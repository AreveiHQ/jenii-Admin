"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

// Validation schema
const validationSchema = Yup.object().shape({
  desktopbanner: Yup.mixed().required("Image is required"),
  mobilebanner: Yup.mixed().required("Image is required"),
  links: Yup.string()
    .test(
      "is-url-or-path",
      "The field must be a valid URL or path",
      (value) => {
        if (!value) return false;

        // Check if it's a valid URL
        try {
          new URL(value);
          return true;
        } catch (e) {
          // Not a valid URL, so check if it's a valid path format
          const pathRegex = /^(\/[\w\-]+)+$/;
          return pathRegex.test(value);
        }
      }
    )
    .required("This field is required"),
  section: Yup.string().required("Section is required"),
});

export default function UploadPage() {
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const [desktoppreview, setdesktopPreview] = useState(null);
  const [mobilepreview, setMobilePreview] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleOpen = () => setOpen(!open);

  const onSubmit = async (data) => {
    try {
      setLoad(true)
      const formData = new FormData();
      formData.append("links", data.links);
      formData.append("section", data.section);
      formData.append("desktopbanner", data.desktopbanner[0]);
      formData.append("mobilebanner", data.mobilebanner[0]);

      const response = await axios.post("/api/slides", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload successful:", response.data);
      setMobilePreview(null)
      setdesktopPreview(null)
      reset(); 
      setOpen(false); // Close modal on successful upload
      setLoad(false)
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Handle image preview
  const desktopBannerChange = (e) => {
    const file = e.target.files[0];
        setValue("images", e.target.files);// Set file for form submission
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setdesktopPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const mobileBannerChange = (e) => {
    const file = e.target.files[0];
        setValue("images", e.target.files);// Set file for form submission
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setMobilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
    
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Upload Slide
      </Button>

      <Dialog open={open} onClose={handleOpen} fullWidth maxWidth="sm">
       <DialogTitle>Upload Slide</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Image Upload */}
            <div>
              <p>Banner Image (for Desktop Screen)</p>
              <input
                type="file"
                accept="image/*"
                {...register("desktopbanner")}
                onChange={desktopBannerChange}
              />
              {errors.desktopbanner && (
                <p className="text-red-500 text-sm">{errors.desktopbanner.message}</p>
              )}
              {desktoppreview && (
                <img
                  src={desktoppreview}
                  alt="Preview"
                  className="w-full h-48 object-cover mt-2"
                />
              )}
            </div>
            <div>
            <p>Banner Image (for Mobile Screen)</p>
              <input
                type="file"
                accept="image/*"
                {...register("mobilebanner")}
                onChange={mobileBannerChange}
              />
              {errors.mobilebanner && (
                <p className="text-red-500 text-sm">{errors.mobilebanner.message}</p>
              )}
              {mobilepreview && (
                <img
                  src={mobilepreview}
                  alt="Preview"
                  className="w-full h-48 object-cover mt-2"
                />
              )}
            </div>

            {/* Link Input */}
            <TextField
              label="Link"
              variant="outlined"
              fullWidth
              {...register("links")}
              error={!!errors.links}
              helperText={errors.links?.message}
            />

            {/* Section Select */}
            <Controller
              name="section"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Select Section"
                  variant="outlined"
                  fullWidth
                  {...field}
                  error={!!errors.section}
                  helperText={errors.section?.message}
                >
                  <MenuItem value="hero-slider">Hero Slider</MenuItem>
                  <MenuItem value="about-slider">About Slider</MenuItem>
                </TextField>
              )}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOpen} color="error">
            Cancel
          </Button>
          {load? <button disabled="" type="button" className="py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center">
    <svg aria-hidden="true" role="status" className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"></path>
    </svg>
    Loading...
</button>:  <Button onClick={handleSubmit(onSubmit)} variant="contained" color="success">
            Upload
          </Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
}
