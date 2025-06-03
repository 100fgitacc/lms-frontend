
export default function IconBtn({ text, onclick, children, disabled, outline = false, customClasses, type, }) {


    return (
        <button
            disabled={disabled}
            onClick={onclick}
            className={`button 
                ${['Save', 'Save Changes', 'Next', 'Edit Section Name', 'Create Section'].includes(text)
                ? 'constructor-btn'
                : text === 'Mark As Completed'
                ? 'completed-btn'
                : text === 'Rewatch'
                ? 'rewatch-btn'
                : ''}`}
            type={type}
        >
            {
                children ? (
                    <>
                        <span>{text}</span>
                        {children}
                    </>
                ) :
                    (text)
            }
        </button>
    )
}