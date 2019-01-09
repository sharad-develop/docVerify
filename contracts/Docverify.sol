pragma solidity ^0.4.17;
contract Docverify {
    
    string public message;
    struct docDetails {
        string dataHash;
        string status;
        bool isDiscoverable;
        address verifiedBy;
        address requestedBy;
    }
    
    //owner to docs mapping
    mapping(address => docDetails[]) docs;
    
    //verifier to docs mapping
    mapping(address => docDetails[]) docsToVerify;

   //get the status of the doc 
    function getDocStatus(address owner, string docHash) public returns(string) {
        
        docDetails[] storage dd = docs[owner];
          for(uint i=0; i<dd.length; i++ ){
              
                    if(getHash(docHash) == getHash(dd[i].dataHash)
                        && (dd[i].isDiscoverable == true || msg.sender == owner)){
                    
                        return dd[i].status;
                    }
              
          }
          
          return "UNKNOWN";
        
    }
    
    //update discoverable attribute if document
    function updateDocDetails(string docHash, bool isDiscoverable) public {
        
        docDetails[] storage dd = docs[msg.sender];
        for(uint i=0; i< dd.length; i++ ){
        
            if(getHash(docHash) == getHash(dd[i].dataHash)) {
            
                dd[i].isDiscoverable = isDiscoverable;
            }
                  
        }
    }
    
    //Add docs to verify
    function addDocToVerify(address verifier, string dataHash, bool isDiscoverable) public {
        
        docDetails[] storage dd = docsToVerify[verifier];
        //create a new doc
        docDetails memory newDoc = docDetails({dataHash: dataHash, status: "QUEUED", isDiscoverable: isDiscoverable, 
                    verifiedBy: address(0), requestedBy: msg.sender} );
                    
        //add to the list of docs to verify            
        dd.push(newDoc);
        docs[msg.sender] = dd;
      
    }
    
    //verify a doc
    function verifyDoc(address docOwner, string docHash) public {
        //get doc details for the user
        docDetails[] storage dd = docsToVerify[msg.sender];
        
        for(uint i=0; i<dd.length; i++ ){
            //verify if doc hashes match
            if(getHash(docHash) == getHash(dd[i].dataHash)) {
                
                //update docs map
                //get docs for the owner
                docDetails[] storage requestorDocs = docs[dd[i].requestedBy];
                
                //iterate through owner's docs
                for(uint j=0; j<requestorDocs.length; j++){
                    
                    //verify if docs match
                    if(getHash(docHash) == getHash(requestorDocs[j].dataHash)) {
                        
                            //update docs status
                            docDetails storage updatedDetails = requestorDocs[j];
                            updatedDetails.verifiedBy = msg.sender;
                            updatedDetails.status = "VERIFIED";
                            
                            //remove the doc from the verifier map
                            delete dd[i];
                        
                    }
                }
            
            }
        }
        
    }

    function getHash(string dataHash) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(dataHash));
    }

    
}