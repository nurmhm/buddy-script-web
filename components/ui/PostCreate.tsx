"use client";

import { useCreatePost } from "@/lib/queries/post";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

interface PostData {
  content: string;
  image: File | null;
  imagePreview: string | null;
  visibility: "PUBLIC" | "PRIVATE";
}

const PostCreate = () => {
  const [postData, setPostData] = useState<PostData>({
    content: "",
    image: null,
    imagePreview: null,
    visibility: "PUBLIC",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const createPost = useCreatePost();

  const handleImageIconClick = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        console.warn("Please select a valid image file");
        event.target.value = ""; 
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        console.warn("Image size should not exceed 5MB");
        event.target.value = ""; 
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setPostData((prev) => ({
          ...prev,
          image: file,
          imagePreview: preview,
        }));
        console.log("Image selected:", {
          fileName: file.name,
          size: file.size,
          type: file.type,
        });
      };
      reader.readAsDataURL(file);
     
      event.target.value = "";
    }
  };

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setPostData((prev) => ({
      ...prev,
      content: event.target.value,
    }));
  };

  const handleVisibilityChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setPostData((prev) => ({
      ...prev,
      visibility: event.target.value as "PUBLIC" | "PRIVATE",
    }));
  };

  const handlePostSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

   
    if (!postData.content.trim() && !postData.image) {
      console.warn("Please enter content or select an image");
      return;
    }

    createPost.mutate({
      content: postData.content,
      image: postData.image,
      visibility: postData.visibility,
    });

    // Reset form
    setPostData({
      content: "",
      image: null,
      imagePreview: null,
      visibility: "PUBLIC",
    });
    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handlePostSubmit}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
        aria-label="Upload image"
      />

      {postData.imagePreview && (
        <div
          style={{
            marginBottom: "12px",
            padding: "12px",
            position: "relative",
          }}
        >
          <img
            src={postData.imagePreview}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "200px",
              borderRadius: "8px",
              marginBottom: "8px",
              display: "block",
            }}
          />
          <button
            type="button"
            onClick={() => {
              setPostData({
                content: postData.content,
                image: null,
                imagePreview: null,
                visibility: postData.visibility,
              });

              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            style={{
              padding: "6px 12px",
              backgroundColor: "#ff4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Remove Image
          </button>
        </div>
      )}

      <div className="_feed_inner_text_area_box">
        <div className="_feed_inner_text_area_box_image">
          <img
            src="assets/images/txt_img.png"
            alt="Image"
            className="_txt_img"
          />
        </div>
        <div className="form-floating _feed_inner_text_area_box_form">
          <textarea
            ref={textareaRef}
            className="form-control _textarea"
            placeholder="Leave a comment here"
            id="floatingTextarea"
            value={postData.content}
            onChange={handleTextChange}
          ></textarea>
          <label className="_feed_textarea_label" htmlFor="floatingTextarea">
            Write something ...
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="24"
              fill="none"
              viewBox="0 0 23 24"
            >
              <path
                fill="#666"
                d="M19.504 19.209c.332 0 .601.289.601.646 0 .326-.226.596-.52.64l-.081.005h-6.276c-.332 0-.602-.289-.602-.645 0-.327.227-.597.52-.64l.082-.006h6.276zM13.4 4.417c1.139-1.223 2.986-1.223 4.125 0l1.182 1.268c1.14 1.223 1.14 3.205 0 4.427L9.82 19.649a2.619 2.619 0 01-1.916.85h-3.64c-.337 0-.61-.298-.6-.66l.09-3.941a3.019 3.019 0 01.794-1.982l8.852-9.5zm-.688 2.562l-7.313 7.85a1.68 1.68 0 00-.441 1.101l-.077 3.278h3.023c.356 0 .698-.133.968-.376l.098-.096 7.35-7.887-3.608-3.87zm3.962-1.65a1.633 1.633 0 00-2.423 0l-.688.737 3.606 3.87.688-.737c.631-.678.666-1.755.105-2.477l-.105-.124-1.183-1.268z"
              />
            </svg>
          </label>
        </div>
      </div>

      <div
        style={{
          padding: "12px",
          borderTop: "1px solid #eee",
          marginBottom: "4px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",

            gap: "8px",
            fontSize: "14px",
          }}
        >
          <input
            type="radio"
            name="visibility"
            value="PUBLIC"
            checked={postData.visibility === "PUBLIC"}
            onChange={handleVisibilityChange}
          />
          Public
        </label>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
          }}
        >
          <input
            type="radio"
            name="visibility"
            value="PRIVATE"
            checked={postData.visibility === "PRIVATE"}
            onChange={handleVisibilityChange}
          />
          Private
        </label>
      </div>
      <div className="_feed_inner_text_area_bottom">
        <div className="_feed_inner_text_area_item">
          <div className="_feed_inner_text_area_bottom_photo _feed_common">
            <button
              type="button"
              className="_feed_inner_text_area_bottom_photo_link"
              onClick={handleImageIconClick}
              style={{
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill="#666"
                    d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z"
                  />
                </svg>
              </span>
              Photo
            </button>
          </div>
          <div className="_feed_inner_text_area_bottom_video _feed_common">
            <button
              type="button"
              className="_feed_inner_text_area_bottom_photo_link"
            >
              {" "}
              <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="24"
                  fill="none"
                  viewBox="0 0 22 24"
                >
                  <path
                    fill="#666"
                    d="M11.485 4.5c2.213 0 3.753 1.534 3.917 3.784l2.418-1.082c1.047-.468 2.188.327 2.271 1.533l.005.141v6.64c0 1.237-1.103 2.093-2.155 1.72l-.121-.047-2.418-1.083c-.164 2.25-1.708 3.785-3.917 3.785H5.76c-2.343 0-3.932-1.72-3.932-4.188V8.688c0-2.47 1.589-4.188 3.932-4.188h5.726zm0 1.5H5.76C4.169 6 3.197 7.05 3.197 8.688v7.015c0 1.636.972 2.688 2.562 2.688h5.726c1.586 0 2.562-1.054 2.562-2.688v-.686-6.329c0-1.636-.973-2.688-2.562-2.688zM18.4 8.57l-.062.02-2.921 1.306v4.596l2.921 1.307c.165.073.343-.036.38-.215l.008-.07V8.876c0-.195-.16-.334-.326-.305z"
                  />
                </svg>
              </span>
              Video
            </button>
          </div>
          <div className="_feed_inner_text_area_bottom_event _feed_common">
            <button
              type="button"
              className="_feed_inner_text_area_bottom_photo_link"
            >
              {" "}
              <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="24"
                  fill="none"
                  viewBox="0 0 22 24"
                >
                  <path
                    fill="#666"
                    d="M14.371 2c.32 0 .585.262.627.603l.005.095v.788c2.598.195 4.188 2.033 4.18 5v8.488c0 3.145-1.786 5.026-4.656 5.026H7.395C4.53 22 2.74 20.087 2.74 16.904V8.486c0-2.966 1.596-4.804 4.187-5v-.788c0-.386.283-.698.633-.698.32 0 .584.262.626.603l.006.095v.771h5.546v-.771c0-.386.284-.698.633-.698zm3.546 8.283H4.004l.001 6.621c0 2.325 1.137 3.616 3.183 3.697l.207.004h7.132c2.184 0 3.39-1.271 3.39-3.63v-6.692zm-3.202 5.853c.349 0 .632.312.632.698 0 .353-.238.645-.546.691l-.086.006c-.357 0-.64-.312-.64-.697 0-.354.237-.645.546-.692l.094-.006zm-3.742 0c.35 0 .632.312.632.698 0 .353-.238.645-.546.691l-.086.006c-.357 0-.64-.312-.64-.697 0-.354.238-.645.546-.692l.094-.006zm-3.75 0c.35 0 .633.312.633.698 0 .353-.238.645-.547.691l-.093.006c-.35 0-.633-.312-.633-.697 0-.354.238-.645.547-.692l.094-.006zm7.492-3.615c.349 0 .632.312.632.697 0 .354-.238.645-.546.692l-.086.006c-.357 0-.64-.312-.64-.698 0-.353.237-.645.546-.691l.094-.006zm-3.742 0c.35 0 .632.312.632.697 0 .354-.238.645-.546.692l-.086.006c-.357 0-.64-.312-.64-.698 0-.353.238-.645.546-.691l.094-.006zm-3.75 0c.35 0 .633.312.633.697 0 .354-.238.645-.547.692l-.093.006c-.35 0-.633-.312-.633-.698 0-.353.238-.645.547-.691l.094-.006zm6.515-7.657H8.192v.895c0 .385-.283.698-.633.698-.32 0-.584-.263-.626-.603l-.006-.095v-.874c-1.886.173-2.922 1.422-2.922 3.6v.402h13.912v-.403c.007-2.181-1.024-3.427-2.914-3.599v.874c0 .385-.283.698-.632.698-.32 0-.585-.263-.627-.603l-.005-.095v-.895z"
                  />
                </svg>
              </span>
              Event
            </button>
          </div>
          <div className="_feed_inner_text_area_bottom_article _feed_common">
            <button
              type="button"
              className="_feed_inner_text_area_bottom_photo_link"
            >
              {" "}
              <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="20"
                  fill="none"
                  viewBox="0 0 18 20"
                >
                  <path
                    fill="#666"
                    d="M12.49 0c2.92 0 4.665 1.92 4.693 5.132v9.659c0 3.257-1.75 5.209-4.693 5.209H5.434c-.377 0-.734-.032-1.07-.095l-.2-.041C2 19.371.74 17.555.74 14.791V5.209c0-.334.019-.654.055-.96C1.114 1.564 2.799 0 5.434 0h7.056zm-.008 1.457H5.434c-2.244 0-3.381 1.263-3.381 3.752v9.582c0 2.489 1.137 3.752 3.38 3.752h7.049c2.242 0 3.372-1.263 3.372-3.752V5.209c0-2.489-1.13-3.752-3.372-3.752zm-.239 12.053c.36 0 .652.324.652.724 0 .4-.292.724-.652.724H5.656c-.36 0-.652-.324-.652-.724 0-.4.293-.724.652-.724h6.587zm0-4.239a.643.643 0 01.632.339.806.806 0 010 .78.643.643 0 01-.632.339H5.656c-.334-.042-.587-.355-.587-.729s.253-.688.587-.729h6.587zM8.17 5.042c.335.041.588.355.588.729 0 .373-.253.687-.588.728H5.665c-.336-.041-.589-.355-.589-.728 0-.374.253-.688.589-.729H8.17z"
                  />
                </svg>
              </span>
              Article
            </button>
          </div>
        </div>
        <div className="_feed_inner_text_area_btn">
          <button
            type="submit"
            className="_feed_inner_text_area_btn_link"
            disabled={!postData.content.trim() && !postData.image}
          >
            <svg
              className="_mar_img"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="13"
              fill="none"
              viewBox="0 0 14 13"
            >
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z"
                clipRule="evenodd"
              />
            </svg>{" "}
            <span>Post</span>
          </button>
        </div>
      </div>
      {/* mobile */}
      <div
        style={{
          padding: "12px",
          borderTop: "1px solid #eee",
          marginBottom: "8px",
          display: "none",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            marginBottom: "8px",
          }}
        >
          <input
            type="radio"
            name="visibility-mobile"
            value="PUBLIC"
            checked={postData.visibility === "PUBLIC"}
            onChange={handleVisibilityChange}
          />
          Public
        </label>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
          }}
        >
          <input
            type="radio"
            name="visibility-mobile"
            value="PRIVATE"
            checked={postData.visibility === "PRIVATE"}
            onChange={handleVisibilityChange}
          />
          Private
        </label>
      </div>
      <div className="_feed_inner_text_area_bottom_mobile">
        <div className="_feed_inner_text_mobile">
          <div className="_feed_inner_text_area_item">
            <div className="_feed_inner_text_area_bottom_photo _feed_common">
              <button
                type="button"
                className="_feed_inner_text_area_bottom_photo_link"
                onClick={handleImageIconClick}
                style={{
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#666"
                      d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z"
                    />
                  </svg>
                </span>
              </button>
            </div>
            <div className="_feed_inner_text_area_bottom_video _feed_common">
              <button
                type="button"
                className="_feed_inner_text_area_bottom_photo_link"
              >
                <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="24"
                    fill="none"
                    viewBox="0 0 22 24"
                  >
                    <path
                      fill="#666"
                      d="M11.485 4.5c2.213 0 3.753 1.534 3.917 3.784l2.418-1.082c1.047-.468 2.188.327 2.271 1.533l.005.141v6.64c0 1.237-1.103 2.093-2.155 1.72l-.121-.047-2.418-1.083c-.164 2.25-1.708 3.785-3.917 3.785H5.76c-2.343 0-3.932-1.72-3.932-4.188V8.688c0-2.47 1.589-4.188 3.932-4.188h5.726zm0 1.5H5.76C4.169 6 3.197 7.05 3.197 8.688v7.015c0 1.636.972 2.688 2.562 2.688h5.726c1.586 0 2.562-1.054 2.562-2.688v-.686-6.329c0-1.636-.973-2.688-2.562-2.688zM18.4 8.57l-.062.02-2.921 1.306v4.596l2.921 1.307c.165.073.343-.036.38-.215l.008-.07V8.876c0-.195-.16-.334-.326-.305z"
                    />
                  </svg>
                </span>
              </button>
            </div>
            <div className="_feed_inner_text_area_bottom_event _feed_common">
              <button
                type="button"
                className="_feed_inner_text_area_bottom_photo_link"
              >
                <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="24"
                    fill="none"
                    viewBox="0 0 22 24"
                  >
                    <path
                      fill="#666"
                      d="M14.371 2c.32 0 .585.262.627.603l.005.095v.788c2.598.195 4.188 2.033 4.18 5v8.488c0 3.145-1.786 5.026-4.656 5.026H7.395C4.53 22 2.74 20.087 2.74 16.904V8.486c0-2.966 1.596-4.804 4.187-5v-.788c0-.386.283-.698.633-.698.32 0 .584.262.626.603l.006.095v.771h5.546v-.771c0-.386.284-.698.633-.698zm3.546 8.283H4.004l.001 6.621c0 2.325 1.137 3.616 3.183 3.697l.207.004h7.132c2.184 0 3.39-1.271 3.39-3.63v-6.692zm-3.202 5.853c.349 0 .632.312.632.698 0 .353-.238.645-.546.691l-.086.006c-.357 0-.64-.312-.64-.697 0-.354.237-.645.546-.692l.094-.006zm-3.742 0c.35 0 .632.312.632.698 0 .353-.238.645-.546.691l-.086.006c-.357 0-.64-.312-.64-.697 0-.354.238-.645.546-.692l.094-.006zm-3.75 0c.35 0 .633.312.633.698 0 .353-.238.645-.547.691l-.093.006c-.35 0-.633-.312-.633-.697 0-.354.238-.645.547-.692l.094-.006zm7.492-3.615c.349 0 .632.312.632.697 0 .354-.238.645-.546.692l-.086.006c-.357 0-.64-.312-.64-.698 0-.353.237-.645.546-.691l.094-.006zm-3.742 0c.35 0 .632.312.632.697 0 .354-.238.645-.546.692l-.086.006c-.357 0-.64-.312-.64-.698 0-.353.238-.645.546-.691l.094-.006zm-3.75 0c.35 0 .633.312.633.697 0 .354-.238.645-.547.692l-.093.006c-.35 0-.633-.312-.633-.698 0-.353.238-.645.547-.691l.094-.006zm6.515-7.657H8.192v.895c0 .385-.283.698-.633.698-.32 0-.584-.263-.626-.603l-.006-.095v-.874c-1.886.173-2.922 1.422-2.922 3.6v.402h13.912v-.403c.007-2.181-1.024-3.427-2.914-3.599v.874c0 .385-.283.698-.632.698-.32 0-.585-.263-.627-.603l-.005-.095v-.895z"
                    />
                  </svg>
                </span>
              </button>
            </div>
            <div className="_feed_inner_text_area_bottom_article _feed_common">
              <button
                type="button"
                className="_feed_inner_text_area_bottom_photo_link"
              >
                <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="20"
                    fill="none"
                    viewBox="0 0 18 20"
                  >
                    <path
                      fill="#666"
                      d="M12.49 0c2.92 0 4.665 1.92 4.693 5.132v9.659c0 3.257-1.75 5.209-4.693 5.209H5.434c-.377 0-.734-.032-1.07-.095l-.2-.041C2 19.371.74 17.555.74 14.791V5.209c0-.334.019-.654.055-.96C1.114 1.564 2.799 0 5.434 0h7.056zm-.008 1.457H5.434c-2.244 0-3.381 1.263-3.381 3.752v9.582c0 2.489 1.137 3.752 3.38 3.752h7.049c2.242 0 3.372-1.263 3.372-3.752V5.209c0-2.489-1.13-3.752-3.372-3.752zm-.239 12.053c.36 0 .652.324.652.724 0 .4-.292.724-.652.724H5.656c-.36 0-.652-.324-.652-.724 0-.4.293-.724.652-.724h6.587zm0-4.239a.643.643 0 01.632.339.806.806 0 010 .78.643.643 0 01-.632.339H5.656c-.334-.042-.587-.355-.587-.729s.253-.688.587-.729h6.587zM8.17 5.042c.335.041.588.355.588.729 0 .373-.253.687-.588.728H5.665c-.336-.041-.589-.355-.589-.728 0-.374.253-.688.589-.729H8.17z"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
          <div className="_feed_inner_text_area_btn">
            <button
              type="submit"
              className="_feed_inner_text_area_btn_link"
              disabled={!postData.content.trim() && !postData.image}
            >
              <svg
                className="_mar_img"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="13"
                fill="none"
                viewBox="0 0 14 13"
              >
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z"
                  clipRule="evenodd"
                />
              </svg>{" "}
              <span>Post</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PostCreate;
