import "./createGroupModal.css";

export default function CreateGroupModal({ open, onClose }) {
    return (
        open && (
            <div className="group-backdrop">
                <div className="modal-info">
                    {/* todo: give the option to add a group image */}
                    {/* <input placeholder="Enter Group name" /> */}
                </div>
            </div>
        )
    );
}
