const supportedMimeFormats = [
"image/png",
"image/PNG",
"image/jpg",
"image/JPG",
"image/jpeg",
"image/JPEG",
"image/JPEG",
"image/gif",
"image/avif"
];

export function validateMimeTypes (image) {
    if(image) {
        return supportedMimeFormats.includes(image.mimetype);
    }
    return null;


}