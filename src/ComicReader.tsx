import { useRef, useState } from "react";
import { IoSwapHorizontal, IoSwapVertical, IoArrowBack, IoArrowForward, IoChevronForward, IoChevronBack } from "react-icons/io5"

function ComicReader(props: { images: string[] }) {
    const [vertical, setIsVertical] = useState<boolean>(false)
    const [left2right, setLeft2Right] = useState<boolean>(false);
    const [verticalScrollIdx, setVerticalScrollIdx] = useState<number>(0);


    const scrollFieldRef = useRef<HTMLDivElement>(null);

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (scrollFieldRef.current) {
            scrollFieldRef.current.scrollBy({ left: e.deltaY });

        }
    }

    const handleVerticalScroll = () => {
        if (!scrollFieldRef.current) {
            return;
        }
        const currentVisible = document.getElementById("comic-img#" + verticalScrollIdx);
        if (!currentVisible) {

            setVerticalScrollIdx(0);
            return;
        }


        const boundingVal = currentVisible.getBoundingClientRect();


        for (let i = verticalScrollIdx - ((boundingVal.y > 0) ? 1 : 0); (boundingVal.y < 0 ? (i < props.images.length) : (i > -1)); (boundingVal.y < 0 ? i++ : i--)) {
            const element = document.getElementById("comic-img#" + i);
            if (!element) {
                break;
            }
            const elementbound = element.getBoundingClientRect();

            if (elementbound.y > -elementbound.height / 2) {
                setVerticalScrollIdx(i)
                break;
            }
        }
        console.log(verticalScrollIdx);

    }

    const handleHorizontalScroll = () => {
        if (!scrollFieldRef.current) {
            return;
        }
        console.log(scrollFieldRef.current.scrollLeft);

        setVerticalScrollIdx(Math.floor(scrollFieldRef.current.scrollLeft / scrollFieldRef.current.clientWidth * (!left2right ? -1 : 1)))
    }

    const jumpPage = (index: number) => {
        const dst = document.getElementById("comic-img#" + index);
        if (!dst) {
            return;
        }

        dst.scrollIntoView({ behavior: "smooth" });
    }

    const modalRef = useRef<HTMLDialogElement>(null);
    const pageJumpRef = useRef<HTMLInputElement>(null)


    return (<div className="w-full h-ful ">
        <div onWheel={handleWheel} onScroll={vertical ? handleVerticalScroll : handleHorizontalScroll} style={(vertical ? {} : {
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            overflowX: "auto"
        })} ref={scrollFieldRef} className={vertical ? "w-full md:w-2/3 mx-auto h-full overflow-x-hidden overflow-y-auto" : "w-full h-full flex overflow-auto scrollbar-none " + (!left2right && "flex-row-reverse")}>
            {props.images.map((src, i) => (<div key={i} id={"comic-img#" + i} style={(vertical ? {} : {
                flexGrow: 1,
                flexBasis: "100%",
                flexShrink: 0,
                scrollSnapAlign: "start",

            })} className={vertical ? "w-full" : "w-full h-full"}>
                <img
                    className={vertical ? "w-full" : " object-contain  w-full h-full"}

                    src={src}>
                </img></div>))}
        </div>
        <div className="bottom-2 bg-white w-fit h-fit px-5 gap-3 shadow-md py-2 left-1/2 -translate-x-1/2 flex text-2xl rounded-full absolute">
            <button onClick={() => jumpPage(verticalScrollIdx - ((!vertical && !left2right) ? -1 : 1))} ><IoChevronBack /></button>

            <label className={"swap swap-rotate " + (vertical && "swap-active")} onClick={() => setIsVertical(!vertical)}>
                <div className="swap-on"> <IoSwapVertical /></div>
                <div className="swap-off" > <  IoSwapHorizontal /></div>
            </label>
            {!vertical &&
                (<label className={"swap swap-rotate " + (left2right && "swap-active")} onClick={() => setLeft2Right(!left2right)}>

                    <div className="swap-off"><IoArrowBack /></div>
                    <div className="swap-on"> <IoArrowForward /></div>
                </label>)}
            <button className="text-base" onClick={() => (modalRef.current && modalRef.current.showModal())}>{verticalScrollIdx + 1}</button>
            <button onClick={() => jumpPage(verticalScrollIdx + ((!vertical && !left2right) ? -1 : 1))} ><IoChevronForward /></button>
        </div>
        <dialog ref={modalRef} className="modal  text-black">
            <div className="modal-box p-3 w-fit flex items-center gap-3 justify-center">
                <input ref={pageJumpRef} type="number" className="input input-sm input-bordered" placeholder="Index" min={1} max={props.images.length} />
                <button onClick={() => { console.log(modalRef.current && (modalRef.current.close())); jumpPage((pageJumpRef.current && pageJumpRef.current.valueAsNumber - 1) || verticalScrollIdx) }} className="btn btn-success btn-sm ">Jump</button>
            </div>
            <form method="dialog" className="modal-backdrop "><button>close</button></form>
        </dialog>
    </div>
    )
}

export default ComicReader;