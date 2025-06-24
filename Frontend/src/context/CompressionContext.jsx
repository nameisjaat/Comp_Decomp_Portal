import { createContext, useState } from "react";

export const CompressionContext = createContext(null);

const CompressionContextProvider = (props) => {
    const [result,setResult] = useState(null);

    const contextValue={
        result,
        setResult
    }

    return (
        <CompressionContext.Provider value={contextValue}>
            {props.children}
        </CompressionContext.Provider>
    )
}
export default CompressionContextProvider;