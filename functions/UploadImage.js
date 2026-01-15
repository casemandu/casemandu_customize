export async function UploadImage(image){
    const api = process.env.NEXT_PUBLIC_IMGBB;
    const formData = new FormData();
    formData.append("image", image);
    const res = await fetch("https://api.imgbb.com/1/upload?key="+api, {
        method: "POST",
        body: formData,
    });
    const data = await res.json();
    return data;
}