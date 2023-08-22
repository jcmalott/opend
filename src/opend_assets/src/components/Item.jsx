import React, { useEffect, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { Principal } from "@dfinity/principal";
import { opend } from "../../../declarations/opend";
import Button from "./Button";

function Item({id}) {

  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();

  // const canisterId = Principal.fromText(id);
  const canisterId = id;
  const localhost = "http://localhost:8080/";
  const agent = new HttpAgent({host: localhost});
  // TODO: This should be removed if going live
  agent.fetchRootKey(); // Skips the process of connecting to Internet Computer
  let NFTActor;

  useEffect(() => {
    loadNFT();
  }, []);

  async function loadNFT() {
    NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: canisterId
    });

    const ownerPrincipal = await NFTActor.getOwner();
    const imageData =  await NFTActor.getContent();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(new Blob([imageContent.buffer], {type: "image/png"}));

    setName(await NFTActor.getName());
    setOwner(ownerPrincipal.toText());
    setImage(image);

    setButton(<Button handleClick={handleSell} text={"Sell"}/>);
  };

  let price;
  function handleSell() {
    console.log("Sell Clicked");
      setPriceInput(<input
        placeholder="Price in DANG"
        type="number"
        className="price-input"
        value={price}
        onChange={e => price = e.target.value}
      />
    );

    setButton(<Button handleClick={sellItem} text={"Confirm"}/>);
  }

  async function sellItem() {
    console.log("Confirmed Clicked!");
    const listingResult = await opend.listItem(id, Number(price));
    console.log(listingResult);
    if(listingResult == "Success") {
      const openDId = await opend.getOpenDCanisterID();
      const result = await NFTActor.transferOwnership(openDId);
      console.log(result);
    }
  }

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
