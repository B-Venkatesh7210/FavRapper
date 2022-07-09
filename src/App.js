import React, { useState, useEffect } from "react";
import Moralis from "moralis";
import { useMoralis } from "react-moralis";
import { getEllipsisTxt } from "./helpers/formatters";
import contractABI from "./Contract/contractABI.json";

function App() {
  Moralis.initialize("VqOZo9UhYszLp4ymgATazjFBBst4K16IDa0c5QZL");
  Moralis.serverURL = "https://uw2nlqw7utdw.usemoralis.com:2053/server";

  const contractAddress = "0x76f966d5d2B8523e969A56100cAE08FEc102443a";

  const { authenticate, isAuthenticated, user, logout } = useMoralis();

  const [formData, setFormData] = useState({
    desp: "",
    file: undefined,
  });

  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    const getAllPosts = async () => {
      await Moralis.enableWeb3();

      const options = {
        contractAddress: contractAddress,
        abi: contractABI,
        functionName: "getAllPosts",
      };

      setAllPosts(await Moralis.executeFunction(options));
      console.log(allPosts);
    };
    if (isAuthenticated) {
      getAllPosts();
      console.log(user.get("ethAddress"));
    }
  }, [isAuthenticated, user]);

  const login = async () => {
    if (!isAuthenticated) {
      await authenticate({ signingMessage: "Log in using Moralis" })
        .then(function (user) {
          console.log(user.get("ethAddress"));
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      console.log("Already logged In");
    }
  };

  const logOut = async () => {
    await logout();
    console.log("logged out");
  };

  const uploadImage = async () => {
    const data = formData.file[0];
    const file = new Moralis.File(data.name, data);
    await file.saveIPFS();
    console.log(file.ipfs(), file.hash());
    return file.ipfs();
  };

  const uploadMetadata = async (imageURL) => {
    const metadata = {
      desp: formData.desp,
      image: imageURL,
    };
    const file = new Moralis.File("file.json", {
      base64: btoa(JSON.stringify(metadata)),
    });
    await file.saveIPFS();

    console.log(file.ipfs());
  };

  const onSubmitted = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      login();
    }
    const image = await uploadImage();

    const options = {
      contractAddress: contractAddress,
      abi: contractABI,
      functionName: "addingPost",
      params: {
        _metadataUri: image,
        _desp: formData.desp,
      },
    };

    await Moralis.executeFunction(options);

    await uploadMetadata(image);
  };

  return (
    <div className="mainBg">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "50%",
          height: "50vh",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <span className="title" style={{ fontSize: "80px" }}>
          Fav Rapper
        </span>
        {!user ? (
          <button className="connectWallet" onClick={login}>
            <span clasName="title" style={{ fontSize: "15px" }}>
              Connect Wallet
            </span>
          </button>
        ) : (
          <button className="connectWallet" onClick={logOut}>
            <span clasName="title" style={{ fontSize: "15px" }}>
              {getEllipsisTxt(user.get("ethAddress"), 6)}
            </span>
          </button>
        )}

        <span className="title" style={{ fontSize: "40px" }}>
          Upload picture of your favourite rapper
        </span>
        <form
          onSubmit={onSubmitted}
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <textarea
            className="textfield"
            style={{ width: "40%", height: "5rem" }}
            type="text"
            value={formData.desp}
            placeholder="Type about your favourite rapper"
            onChange={(e) => {
              setFormData({ ...formData, desp: e.target.value });
            }}
          ></textarea>
          <input
            type="file"
            style={{ marginLeft: "3rem" }}
            onChange={(e) => {
              setFormData({ ...formData, file: e.target.files });
              e.preventDefault();
            }}
          ></input>
          <input
            className="textfield"
            type="submit"
            style={{ width: "10rem", height: "3rem", fontSize: "20px" }}
          ></input>
        </form>
      </div>
      <div
        className="random"
        style={{width: "100%", overflow: "scroll"}}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {allPosts.map((allPost) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center",
                height: "20rem",
                width: "20rem",
                margin: "0rem 2rem"
              }}
            >
              <img
                src={allPost.metadataUri}
                alt="rapper"
                style={{ width: "10rem", height: "10rem" }}
              ></img>
              <span className="title" style={{ fontSize: "15px" }}>
                Creator: {getEllipsisTxt(allPost.creator, 6)}
              </span>
              <span className="title" style={{ fontSize: "18px" }}>{allPost.desp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
