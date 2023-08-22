import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

actor class NFT (name: Text, owner: Principal, content: [Nat8]) {
    Debug.print("Working");

    public query func getName() : async Text {
        return name;
    };

    public query func getOwner() : async Principal {
        return owner;
    };

    public query func getContent() : async [Nat8] {
        return content;
    };
};