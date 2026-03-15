import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Array "mo:core/Array";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type JobType = {
    #repair;
    #replacement;
    #inspection;
    #emergency;
  };

  public type Lead = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    postcode : Text;
    jobType : JobType;
    message : ?Text;
    createdAt : Int;
  };

  stable var stableLeads : [(Nat, Lead)] = [];
  stable var stableNextLeadId : Nat = 0;

  let leads = Map.fromIter<Nat, Lead>(stableLeads.vals());
  var nextLeadId = stableNextLeadId;

  system func preupgrade() {
    stableLeads := leads.entries().toArray();
    stableNextLeadId := nextLeadId;
  };

  public shared ({ caller }) func submitLead(name : Text, phone : Text, email : Text, postcode : Text, jobType : JobType, message : ?Text) : async Lead {
    if (name == "" or phone == "" or email == "" or postcode == "") {
      Runtime.trap("All fields except message are required");
    };

    let lead : Lead = {
      id = nextLeadId;
      name;
      phone;
      email;
      postcode;
      jobType;
      message;
      createdAt = Time.now();
    };

    leads.add(nextLeadId, lead);
    nextLeadId += 1;

    lead;
  };

  public query ({ caller }) func getAllLeads() : async [Lead] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all leads");
    };
    leads.values().toArray();
  };

  public query func getAllLeadsPublic() : async [Lead] {
    leads.values().toArray();
  };
};
