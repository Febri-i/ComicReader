// import unzip from "unzip-js"
// import { Button, Modal } from "react-daisyui";
import ComicParser from "./ComicParser";
import { useState } from "react";

// const fileReader = new FileReader();

function handleFile(file: File | null) {

    return new Promise<string[]>((resolve, _reject) => {
        if (file == null) {
            _reject("Error file is null");
            return;
        };

        const extension = file.name.split(".").pop();




        const fileReader = new FileReader();
        fileReader.onload = (e => {
            if (!e.target?.result) {
                _reject("Failed to load file.");
                return;
            }

            ComicParser.parse((e.target.result as ArrayBuffer), (extension as string)).then(resolve).catch(_reject);
        })

        fileReader.readAsArrayBuffer(file);

    });
}

function generateChoiceString(choices: string[]) {
    if (choices.length == 1) {
        return choices[0];
    }

    return choices.slice(0, choices.length - 1).join(", ") + " or " + choices[choices.length - 1]
}

function SelectFile(_props: { readComic: (images: string[]) => void }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<string>();

    const handleGetFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if ((e.target.files && e.target.files.item(0))) {

            const file = e.target.files.item(0)
            setIsLoading(true);

            handleFile(file).then((_data: string[]) => {
                _props.readComic(_data);
            }).catch(reason => setIsError(reason));
        }
        // props.readComic())

    }

    return (<div className='bg-gray-800 text-gray-100 shadow-md rounded-xl flex flex-col gap-3 p-5 w-96 h-fit mx-auto  self-center '>
        <h1 className='text-3xl font-bold'>Comic Book Archive Reader</h1>
        <span>Open {generateChoiceString(ComicParser.supportedExt.map(ext => "." + ext))} file!</span>
        <div className="relative max-w-min overflow-hidden rounded-lg">
            {(isLoading && (<div className="inset-0 bg-[rgba(255,255,255,0.43)] flex items-center justify-center  absolute"><span className="loading bg-black loading-dots loading-lg"></span></div>))}
            <input type="file" onChange={handleGetFiles} className='file-input file-input-sm  bg-transparent file-input-bordered file-input-accent' />
        </div>
        {isError?.length && (<span>Error: {isError}</span>)}

    </div>)
}

export default SelectFile;