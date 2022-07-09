// SPDX-License-Identifier: GPL-3.0 
// contractAddress = "0x76f966d5d2B8523e969A56100cAE08FEc102443a"
pragma solidity 0.8.7;

contract FavRapper{
    uint public id;

    event PostAdded(uint postId, address creator, string desp, string metadataUri);

    struct Post{
        uint postId;
        address creator;
        string desp;
        string metadataUri;
    }

    mapping (uint=>Post) public idToPost;

    function addingPost(string memory _metadataUri, string memory _desp) public {
        idToPost[id] = Post(id, msg.sender, _desp, _metadataUri);
        id++;
        emit PostAdded(id, msg.sender, _desp, _metadataUri);
    }

    function getAllPosts() public view returns (Post[] memory) {
        Post[] memory allPosts = new Post[](id);
        for(uint i=0; i<id; i++)
        {
            Post storage currPost = idToPost[i];
            allPosts[i] = currPost;
        }
        return allPosts;
        
    }
}