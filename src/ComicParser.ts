import JSZip from "jszip";
import { RenderParameters } from "pdfjs-dist/types/src/display/api";
import { PDFDocumentProxy } from "pdfjs-dist";

export default {
    supportedExt: ["cbz", "pdf"], parse: (data: ArrayBuffer, extension: string) => {

        return new Promise<string[]>(async (resolve, reject) => {

            switch (extension) {

                case "cbz": {
                    // console.log(findMimeType);

                    JSZip.loadAsync(data).then(async (zip: JSZip) => {
                        const allfile: string[] = Object.keys(zip.files);
                        const imageResult: string[] = [];

                        for (let i = 0; i < allfile.length; i++) {
                            const file = zip.file(allfile[i]);
                            if (!file) {
                                break;
                            }
                            const fileContent = await file?.async("blob");
                            imageResult.push(window.URL.createObjectURL(fileContent));
                        }
                        resolve(imageResult);
                    }).catch(reject);
                    break;
                }
                case "pdf": {
                    const PDFjs = await import("pdfjs-dist")
                    PDFjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js"

                    console.log("Successs creatin ");
                    const imageList: string[] = [];

                    const loadingtask = PDFjs.getDocument(data)
                    loadingtask.onProgress = (e: any) => console.log(e);
                    loadingtask.onPassword = (e: any) => console.log(e);


                    loadingtask.promise.then(async (pdf: PDFDocumentProxy) => {
                        console.log("BITCHWHAT");

                        try {
                            for (let i = 1; i <= pdf.numPages; i++) {
                                const canvas = document.createElement("canvas");
                                const context2d = canvas.getContext("2d");
                                if (context2d == null) {
                                    console.log("BITCHWHAT");

                                    reject("Error unable to create CanvasRenderingContext2D")
                                    return;
                                }
                                const page = (await pdf.getPage(i));
                                const viewport = page.getViewport({ scale: 1.5 });
                                const outputScale = window.devicePixelRatio || 1;

                                canvas.width = viewport.width * outputScale;
                                canvas.height = viewport.height * outputScale

                                canvas.style.width = viewport.width * outputScale + 'px';
                                canvas.style.height = viewport.height * outputScale + 'px';

                                const transform = outputScale !== 1
                                    ? [outputScale, 0, 0, outputScale, 0, 0]
                                    : null;
                                const renderContext: RenderParameters = {
                                    canvasContext: context2d,
                                    transform: (transform as any[]),
                                    viewport: viewport
                                };

                                await page.render(renderContext).promise;

                                imageList.push(context2d.canvas.toDataURL());
                            }
                            console.log(imageList);

                            resolve(imageList);

                        } catch (error) {
                            console.log(error);

                            reject(error)
                        }
                    }).catch(error => {
                        console.log(error);

                    })
                    break;
                }

                default:
                    reject("Unsupported extension.")
                    break;
            }
        })
    }
}