export function triggerDownload(blob, filename) {
  try {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    setTimeout(() => {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }, 500);
    return true;
  } catch {
    // fallback below
  }

  try {
    const reader = new FileReader();
    reader.onload = () => {
      const anchor = document.createElement("a");
      anchor.href = reader.result;
      anchor.download = filename;
      anchor.click();
    };
    reader.readAsDataURL(blob);
    return true;
  } catch {
    return false;
  }
}
