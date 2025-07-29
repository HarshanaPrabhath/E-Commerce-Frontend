const Status = ({text,icon:Icon,bg,color}) =>{

    return(
        <div className={`${bg} ${color} items-center gap-2 px-2 py-2 font-medium rounded flex`}>
            {text} <Icon size={15}/>
        </div>
    )

}

export default Status;