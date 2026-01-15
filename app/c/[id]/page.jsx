import EditorMain from "@/components/Editor/EditorMain";
import { GetAllPhone } from "@/functions/GetAllPhone";
import React from "react";



async function page({ params }) {
  const { id } = await params;
  const sublinks = [
    "airpods",
    "mousepads",
    "laptopsleeves",
    "popsockets",
    "phonecases",
  ];
  if (!sublinks.includes(id)) {
    throw new Error("The page you are looking for does not exist");
  }

  let product = [];

  if (id === "phonecases") {
    const data = await GetAllPhone();
    product = data;
  }

  return (
    <div>
      {(id !== "phonecases" && <EditorMain id={id} />) || (
        <EditorMain id={id} product={product} phone={true} />
      )}
    </div>
  );
}

export default page;
