import { getAllPendingScheduledMessages } from "../aggregation/aggregation.pipeline.js";
import { scheduleStatus } from "../constants.config.js";
import { Chat } from "../models/chatModel.js";
import { ScheduledMessage } from "../models/schedule.js";
import cron from "node-cron";
import { getSocketId, io } from "../socket.io.js";

cron.schedule("* * * * *", async () => {
    // one-on-one
    try {
        let result = [];
        const allScheduledMessage = await ScheduledMessage.aggregate(
            getAllPendingScheduledMessages()
        );
        const idsOfScheduledAt = allScheduledMessage?.map(({ _id }) => {
            return _id;
        });
        const idsOfRecipients = allScheduledMessage?.map(({ recipientId }) => {
            return recipientId;
        });
        for await (const {
            message,
            senderId,
            recipientId,
            scheduledAt,
            messageType,
        } of allScheduledMessage) {
            try {
                const messageCreated = await Chat.create({
                    message,
                    senderId,
                    recipientId,
                    messageType,
                });
                result.push(messageCreated);
            } catch (err) {
                console.log("err", err);
            }
        }

        const updateScheduleArray = await ScheduledMessage.updateMany(
            {
                _id: { $in: idsOfScheduledAt },
            },
            {
                $set: {
                    status: scheduleStatus.SENT,
                },
            }
        );
        const accumulatingRecipientId = result?.reduce(function (acc, cur) {
            if (acc[cur?.recipientId]) {
                acc[cur?.recipientId].push(cur);
            } else {
                acc[cur.recipientId] = [cur];
            }
            return acc;
        }, {});

        // figure this out

        for (const recipientId of Object.keys(accumulatingRecipientId)) {
            let id = getSocketId(recipientId);
            if (id) {
                io.to(id).emit(
                    "scheduledMessage",
                    accumulatingRecipientId[recipientId]
                );
            } else {
                console.log("id does not exits so can not send");
            }
        }

        // group
    } catch (error) {
        console.log("error", error);
        console.log("Cron job failed");
    }
});
