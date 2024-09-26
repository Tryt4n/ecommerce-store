import { encode } from "../helpers";
import type { UploadedImage } from "./type";

export async function authenticator() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/api/upload-auth`
    );

    if (!res.ok) {
      throw new Error("Authentication failed!" + res.text());
    }

    const data = await res.json();
    const { token, expire, signature } = data;

    return { token, expire, signature };
  } catch (error) {
    throw new Error("Authentication failed!");
  }
}

export async function uploadFilesToImagekit(
  files: FileList,
  directoryName: string,
  setProgress: (progress: number) => void
) {
  const totalFiles = files.length;
  let totalLoaded = 0;
  const uploadedImages: UploadedImage[] = [];

  for (let i = 0; i < totalFiles; i++) {
    const file = files[i];
    const { token, expire, signature } = await authenticator();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("folder", `Products/${directoryName.replace(" ", "_")}`);
    formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);
    formData.append("signature", signature);
    formData.append("expire", expire);
    formData.append("token", token);

    const url = "https://upload.imagekit.io/api/v1/files/upload";

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          totalLoaded += event.loaded;
          const progress = (totalLoaded / (event.total * totalFiles)) * 100;
          setProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          uploadedImages.push({ url: data.url, id: data.fileId });
          resolve();
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Upload failed!"));
      };

      xhr.send(formData);
    });
  }

  return uploadedImages;
}

export async function deleteImageInImageKit(fileId: string) {
  const url = `https://api.imagekit.io/v1/files/${fileId}`;
  const options = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${encode(process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY)}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function deleteFolderInImageKit(folderPath: string) {
  const url = "https://api.imagekit.io/v1/folder";
  const options = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${encode(process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY)}`,
    },
    body: JSON.stringify({
      folderPath: `Products/${folderPath.replace(" ", "_")}`,
    }),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}
