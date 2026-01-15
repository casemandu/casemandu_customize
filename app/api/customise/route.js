const product = [
  {
    model: "Iphone 15",
    alignment: "left",
    image: "https://i.ibb.co/L00xDHF/iphonn.png",
    brand: "Apple",
  },
];

export async function GET() {
  return Response.json({ data: product });
}
