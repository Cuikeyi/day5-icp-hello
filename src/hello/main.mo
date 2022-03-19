import Text "mo:base/Text";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Option "mo:base/Option";

actor {
    public type Message = {
        author: Text;
        text: Text;
        time: Time.Time;
    };

    stable var _otp: Text = "123456";
    stable var _author: ?Text = null;
    public type Microblog = actor {
        follow: shared(Principal) -> async (); 
        follows: shared query () -> async [Principal];
        post: shared (Text) -> async ();
        posts: shared query (since: Time.Time) -> async [Message];
        timeline: shared (since: Time.Time) -> async [Message];
        get_name: shared () -> async ?Text;
        set_name: shared (Text) -> async ();
    };

    stable var followed : List.List<Principal> = List.nil();

    public shared func follow(id: Principal) : async () {
        followed := List.push(id, followed);
    };

    public shared query func follows() : async [Principal] {
        List.toArray(followed);
    };

    stable var messages : List.List<Message> = List.nil();

    public shared (msg) func post(text: Text, otp: Text) : async () {
        assert(otp == _otp);
        var nickName: Text = "默认：伞兵1号";
        let author: Text = switch _author {
            case null nickName;
            case (?Text) Text;
        };
        let message: Message = {
            author = author;
            time = Time.now();
            text = text;
        };
        messages := List.push<Message>(message, messages);
    };

    public shared query func posts(since: Time.Time) : async [Message] {
        let filterMessages = List.filter<Message>(messages, func(e){e.time >= since});
        List.toArray(filterMessages);
    };

    public shared func timeline(since: Time.Time) : async [Message] {
        var all : List.List<Message> = List.nil();

        for (id in Iter.fromList(followed)) {
            let canister : Microblog = actor(Principal.toText(id));
            let msgs = await canister.posts(since);
            for (msg in Iter.fromArray(msgs)) {
                all := List.push(msg, all);
            };
        };

        List.toArray(all);
    };

    public shared func set_name(name: Text) : async () {
        _author := ?name;
    };

    public shared func get_name() : async ?Text {
        return _author;
    };
};
