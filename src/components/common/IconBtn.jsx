export default function IconBtn({ text, onclick, children, disabled, outline = false, customClasses, type, }) {
    return (
        <button
            disabled={disabled}
            onClick={onclick}
            className={`flex items-center justify-center outline-none ${outline ? "border border-yellow-50 bg-transparent" : "bg-yellow-50 text-black"
                } gap-x-2 rounded-md py-2 px-5 font-semibold  hover:bg-black  hover:bg-yellow-300 duration-300 ${customClasses}
                ${disabled && 'cursor-not-allowed hover:bg-yellow-300 text-black hover:text-white'} `}
            type={type}
        >
            {
                children ? (
                    <>
                        <span className={`${outline && "text-yellow-50"}`}>{text}</span>
                        {children}
                    </>
                ) :
                    (text)
            }
        </button>
    )
}