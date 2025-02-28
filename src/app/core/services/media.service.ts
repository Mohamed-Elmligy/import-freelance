import { Injectable, inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DialogsService } from "src/app/shared/components/ui/custom-dialog/confirmation-dialog.service";

@Injectable({
  providedIn: "root",
})
export class MediaService {
  dialog = inject(DialogsService);

  // will include excel sheets data manipulation in future PRs
  uploadFile(Event: Event) {
    return (Event.target as HTMLInputElement).files;
  }

  displayMedia(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => event;
  }

  fileValidation(file: File, acceptedFormats: string[]) {
    let type =
      file.type.split("/")[0] == "image"
        ? "image"
        : file.type.split("/")[1] == "pdf"
        ? "pdf"
        : "error";

    if (!acceptedFormats.includes(type)) {
      // NOTE: warning message for invalid file format
    }
    return acceptedFormats.includes(type);
  }

  deleteFile(
    controlName: string,
    formData: FormData,
    form: FormGroup,
    input: Event
  ) {
    (input.target as HTMLInputElement).files = null;
    form.get(controlName)?.reset();
    formData.delete(controlName);
  }

  downloadTemplate(url: string) {
    window.open(url, "_blank");
  }

  download(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
