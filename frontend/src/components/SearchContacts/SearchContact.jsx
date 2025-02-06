export default function SearchContacts({
    searchContactGlobal,
    handleSearchContactsGlobally,
}) {
    return (
        <div className="chat-search">
            {/* todo : add the search icon and make that respnosive as well */}
            {/* todo : add the focu:visible class */}
            <input
                type="text"
                value={searchContactGlobal}
                className="font-semibold bg-secondary-400/85 hover:outline-primary hover:outline-4 hover:outline-double"
                placeholder="search globally with email"
                onChange={handleSearchContactsGlobally}
            />
        </div>
    );
}
