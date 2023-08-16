let eq = "36-(20 - ( 10 - 20 ) )"

let eq1 = "2n + (6n+5 + (3n -6))"

let eq2 = "2^(2^(1+1))"

let eq3 = "n^3+n^2+n"

let opCodes = ["+","-","*","/","^"]

let calcPrecidence = (values) =>{
    let OPCODES = ["ADD","SUB","MUL","DIV","PWR"]
    let array = []
    let a = 0
    values.forEach(x => {
        if(OPCODES.includes(x)){
            switch(x){
                case "PWR":
                    array.push({index:a,group:0,opCode:"PWR"})
                break;
                case "MUL":
                    array.push({index:a,group:1,opCode:"MUL"})
                    break;
            
                case "DIV":
                    array.push({index:a,group:1,opCode:"DIV"})
                    break;
        
                case "ADD":
                    array.push({index:a,group:2,opCode:"ADD"})
                    break;
        
                case "SUB":
                    array.push({index:a,group:2,opCode:"SUB"})
                    break;
                default:
                    break;
            }
        }
        a++
    });

    return array
}

let exec = (val_1,opCode,val_2) =>{
    switch (opCode) {
        case "PWR":
            return Math.pow(val_1,val_2);
        case "MUL":
            return val_1*val_2;
        case "DIV":
            return val_1/val_2;

        case "ADD":
            return val_1+val_2;
        case "SUB":
            return val_1-val_2;
        default:
            break;
    }
}

let replaceValues = (values,indexes) =>{
    let result = []
    let res = []
    for (let i = 0; i < values.length; i++) {
        const token= values[i];
        if(indexes.includes(i)){
            res.push(token)
        }
    }
    if(res.length == 3){
        indexes.forEach(idx=>{
            if(indexes.indexOf(idx) == 0){
                for (let i = 0; i < idx; i++) {
                    const token= values[i];
                    result.push(token)
                }
            }else if(indexes.indexOf(idx) == indexes.length-1){
                for (let i = idx+1; i < values.length; i++) {
                    const token= values[i];
                    result.push(token)
                }
            }else{
                for (let i = idx; i < indexes[indexes.indexOf(idx)+1]; i++) {
                    const token= values[i];
                    result.push(exec(res[0],res[1],res[2]))
                }
            }
        })
    }
    return result
}

let getPrecidence = (precidences,opCode) =>{
    for (let i = 0; i < precidences.length; i++) {
        const token = precidences[i];
        
        if(token.opCode == opCode){
            return token;
        }
    }
    return null;
}

let getLastVal = (array) =>{
    return array[array.length - 1];
}

let compile = (values) =>{
    let OPCODES = ["ADD","SUB","MUL","DIV","PWR"]
    let precidences = calcPrecidence(values);
    let res = values

    let groups = []

    precidences.forEach(x=>{
        if(!groups.includes(x.group)){
            groups.push(x.group)
        }
    });
    groups = groups.sort().reverse()

    let side = []
    while(groups.length>0){
        if(groups.length > 1){
            res.forEach(x=>{
                if(OPCODES.includes(x)){
                    let pr = getPrecidence(precidences,x)
                    if(pr.group == getLastVal(groups)){
                        res = replaceValues(res,[pr.index-1,pr.index,pr.index+1])
                        if(typeof(res) == "object"){
                            res.forEach(y=>{
                                if(OPCODES.includes(y)){
                                    pr = getPrecidence(calcPrecidence(res),y)
                                    if(getPrecidence(precidences,y).group == getLastVal(groups)){
                                        let x = pr
                                        res = replaceValues(res,[x.index-1,x.index,x.index+1])
                                        side.push(res)
                                    }
                                }
                            })
                        }
                    }
                }
                
            })
        }else{
            let result = 0
            let opCode = "ADD"
            res.forEach(x=>{
                if(OPCODES.includes(x)){
                    opCode = x
                }else{
                    result = exec(result,opCode,x)
                }
            })
            res = result
        }
            groups.pop()
            
    }

    if(side.length > 0){
        res = getLastVal(side)
        let result = 0
        let opCode = "ADD"
        res.forEach(x=>{
            if(OPCODES.includes(x)){
                opCode = x
            }else{
                result = exec(result,opCode,x)
            }
        })
        res = result
    }


    return res;
    
}


let remWhiteSpaces = (string) =>{
    let str = "";
    if(string != undefined){
        for (let i = 0; i < string.length; i++) {
            const token = string[i];
            if(token != " "){
                str += token
            }
        }
    }
    
    return str
}

let elIndexes = (tokens,element) =>{
    let indexes = []
    let i = 0
    if(element.split('').length == 1){
        tokens.forEach(token => {
            if(token == element){
                indexes.push(i)
            }
            i++
        });
    }else{
        tokens.forEach(token => {
            if(element.split('').includes(token)){
                indexes.push(i)
            }
            i++
        });
    }

    return indexes
}

let isContained = (arr1, arr2) =>{
    let contained = false
    for (let i = 0; i < arr1.length; i++) {
        const el = arr1[i];
        
        for (let j = 0; j < arr2.length; j++) {
            const el2 = arr2[j];
            if(el == el2){
                contained = true;
                break;
            }
        }
    }
    return contained
}

let isContainedStr = (arr,str) =>{
    for (let i = 0; i < arr.length; i++) {
        const x = arr[i];
        if(x.includes(str)){
            return true;
        }
    }
    return false;
}

let indexer = (arr1,arr2) =>{
    let indexes = []
    for (let i = 0; i < arr1.length; i++) {
        const x = arr1[i];
        for (let j = 0; j < arr2.length; j++) {
            const y = arr2[j];
            if(x.includes(y)){
                indexes.push(i)
                break;
            }
        }
    }
    return indexes;
}

let arrCombiner = (split) =>{
    let tokenizeBracketsArr = tokenizeBrackets(split)
    let opIndexes = elIndexes(tokenizeBrackets(split),"+-*/^");
    let str = ""
    let combinedArr = []


    if(!isContained(opCodes,split)){
        for (let i = 0; i < split.length; i++) {
            str += split[i];
        }
        if(str != ""){
            combinedArr.push(str)
        }
        str = ""
    }else{
        opIndexes.forEach(index=>{
            if(opIndexes.indexOf(index) == 0){
                for (let i = 0; i < index; i++) {
                    let token = tokenizeBracketsArr[i]
                    if(!token.includes("(") && !opCodes.includes(token)){
                        str += token
                    }else{
                        combinedArr.push(token)
                    }
                }
                if(str != ""){
                    combinedArr.push(str)
                }
                str = ""
            }else{
                for (let i = opIndexes[opIndexes.indexOf(index)-1]; i < index; i++) {
                    let token = tokenizeBracketsArr[i]
                    if(!token.includes("(") && !opCodes.includes(token)){
                        str += token
                    }else{
                        combinedArr.push(token)
                    }
                }
                if(str != ""){
                    combinedArr.push(str)
                }
                str = ""
            }
            if (opIndexes.indexOf(index) == opIndexes.length-1) {
                for (let i = index; i < tokenizeBracketsArr.length; i++) {
                    let token = tokenizeBracketsArr[i]
                    if(!token.includes("(") && !opCodes.includes(token) ){
                        str += token
                    }else{
                        combinedArr.push(token)
                    }
                }
                if(str != ""){
                    combinedArr.push(str)
                }
                str = ""
            }
        })
    }
    
    return combinedArr
}

let remBrackets = (token) =>{
    let arr = []
    let brackets = []
    let str = ""
    for(let i = 0; i < token.length; i++){
        const el = token[i]
        if(token.includes("(") && token.includes(")")){
            if(el == ")"){
                brackets.pop()
            }
            if(brackets.length > 0){
                str += el
            }
            if(el == "("){
                brackets.push(1)
            }
        }
    }
    arr.push(str)
    return arr
}

let tokenizeBrackets = (split) =>{
    let brackets = []
    let str = ""
    let tokenized = []
    for (let i = 0; i < split.length; i++) {
        const token = split[i];
        if(token == "("){
            brackets.push(1)
        }
        if(brackets.length > 0){
            str += token
        }
        if(token == ")"){
            brackets.pop()
        }
        if(brackets == 0){
            if(str != ""){
                tokenized.push(str)
            }
            str = ""
            if(token != ")"){
                tokenized.push(token)
            }
        }   
    }
    return tokenized
}

let remCalc = (token) =>{
    let index = parseInt(token.split("calc(")[1].replace(")",""))
    return index
}

let getOp = (opCode) =>{
    switch(opCode){
        case "+":
            return "ADD";
        case "-":
            return "SUB";
        case "*":
            return "MUL";
        case "/":
            return "DIV";
        case "^":
            return "PWR";
        default:
            return undefined;
    }
}

// let calculate = (org,evalArr,recursive) =>{
    
//     let res = 0;
//     let origin = org
//     let setOpCode;

//     let values = []

//     if(recursive){
//         if(typeof(evalArr) == "object"){
//             evalArr.forEach(y=>{
//                 if(y.includes("(")){
//                     console.log(origin[remCalc(y)])

//                     let calc = calculate(origin,origin[remCalc(y)],true)
//                     values.push(parseInt(calc))
//                     switch (setOpCode) {
//                         case "ADD":
//                             res += parseInt(calc)
//                             break;
//                         case"SUB":
//                             res -= parseInt(calc)
//                             break;
//                         case"MUL":
//                             res *= parseInt(calc)
//                             break; 
//                         case"DIV":
//                             res /= parseInt(y)
//                             break;
//                         case"PWR":
//                             res = Math.pow(res,y)
//                             break;
//                         default:
//                             break;
//                     }
//                 }
//                 if(!y.includes("(") && !opCodes.includes(y)){
//                     if(setOpCode == undefined){
//                         setOpCode = "ADD"
//                     }
//                     console.log(y)
//                     values.push(parseInt(y))
//                     switch (setOpCode) {
//                         case "ADD":
//                             res += parseInt(y)
//                             break;
//                         case"SUB":
//                             res -= parseInt(y)
//                             break;
//                         case"MUL":
//                             res *= parseInt(y)
//                             break;
//                         case"DIV":
//                             res /= parseInt(y)
//                             break;
//                         case"PWR":
//                             res = Math.pow(res,y)
//                             break;
//                         default:
//                             break;
//                     }
//                 }
//                 if(opCodes.includes(y)){
//                     setOpCode = getOp(y)
//                     values.push(setOpCode)
//                 }
//             })
//         }
//     }else{
//         evalArr.forEach(y=>{
//             if(y.includes("(")){
//                 let calc = calculate(origin,org[remCalc(y)],true)
//                 console.log(origin[remCalc(y)])
                
//                 values.push(parseInt(calc))
//                 switch (setOpCode) {
//                     case "ADD":
//                         res += parseInt(calc)
//                         break;
//                     case"SUB":
//                         res -= parseInt(calc)
//                         break;
//                     case"MUL":
//                         res *= parseInt(calc)
//                         break; 
//                     case"DIV":
//                         res /= parseInt(y)
//                         break;
//                     case"PWR":
//                         res = Math.pow(res,y)
//                         break;
//                     default:
//                         break;
//                 }
//             }
//             if(!y.includes("(") && !opCodes.includes(y)){
//                 if(setOpCode == undefined){
//                     setOpCode = "ADD"
//                 }
//                 values.push(parseInt(y))
//                 switch (setOpCode) {
//                     case "ADD":
//                         res += parseInt(y)
//                         break;
//                     case"SUB":
//                         res -= parseInt(y)
//                         break;
//                     case"MUL":
//                         res *= parseInt(y)
//                         break; 
//                     case"DIV":
//                         res /= parseInt(y)
//                         break;
//                     case"PWR":
//                         res = Math.pow(res,y)
//                         break;
//                     default:
//                         break;
//                 }

//             }
//             if(opCodes.includes(y)){
//                 setOpCode = getOp(y)
//                 values.push(setOpCode)
//             }

//         })
//     }

//     return res
// }

let calculate = (org,evalArr,recursive,term) =>{
    let origin = org
    let values = []
    if(recursive){
        if(isContainedStr(evalArr,"calc(")){
            evalArr.forEach(x=>{
                
                if(x.includes("calc(")){
                    let calc =  calculate(origin,origin[remCalc(x)],true,term)
                    values.push(calc[0])
                }
                if(opCodes.includes(x)){
                    values.push(getOp(x))
                }
                if(!opCodes.includes(x) && !x.includes("calc(")){
                    if(!x.includes("n")){
                        values.push(parseInt(x))
                    }else{
                        values.push(parseInt(x.replace("n",""))*term)
                    }
                }
            })
        }else{
            evalArr.forEach(x=>{
                if(!x.includes("calc(")){
                    if(opCodes.includes(x)){
                        values.push(getOp(x))
                    }else if(!x.includes("n")){
                        values.push(parseInt(x))
                    }else{
                        values.push(parseInt(x.replace("n",""))*term)
                    }
                }
            })
            let num = compile(values)
            values = []
            values.push(num)
        }
    }else{
        if(isContainedStr(evalArr,"calc(")){
            evalArr.forEach(x=>{
                if(x.includes("calc(")){
                    let calc =  calculate(origin,origin[remCalc(x)],true,term)
                    values.push(calc[0])
                }
                if(opCodes.includes(x)){
                    values.push(getOp(x))
                }
                if(!opCodes.includes(x) && !x.includes("calc(")){
                    if(!x.includes("n")){
                        values.push(parseInt(x))
                    }else{
                        values.push(parseInt(x.replace("n",""))*term)
                    }
                }
            })

        }else{
            evalArr.forEach(x=>{
                
                if(opCodes.includes(x)){
                    values.push(getOp(x))
                }
                if(!opCodes.includes(x) && !x.includes("calc(")){
                    if(!x.includes("n")){
                        values.push(parseInt(x))
                        
                    }else{
                        if(x.replace("n","") == ""){
                            values.push(term)
                        }else{
                            values.push(parseInt(x.replace("n",""))*term)
                        }
                    }
                }
            })
        }

    }

    return values

}

let evalute = (array,term) =>{
    let formatted = tokenize(array)
    let evalArr = []
    let rawArr = []

    if(formatted != ""){
        rawArr.push(tokenize(formatted))
        rawArr[0].forEach(element=>{
            if(element.includes("(")){
                rawArr.push(tokenize(remBrackets(element)))
            }
        })
        for (let i = 1; i < rawArr.length; i++) {
            const element = rawArr[i];
            let recursive = false
            element.forEach(token=>{
                
                if(token.includes("(")){
                    recursive = true
                    while(recursive){
                        rawArr.push(tokenize(remBrackets(token)))
                        recursive = false
                    }
                }
            })
            
        }
        let index = 1
        rawArr.forEach(el=>{
            let tempArr = []
            el.forEach(x=>{
                if(x.includes("(")){
                    tempArr.push(`calc(${index})`)
                    index++
                }else{
                    tempArr.push(x)
                }
            })
            if(tempArr.length>0){
                evalArr.push(tempArr)
            }
        })
        
    }
    if(evalArr.length>0){
        // console.log(evalArr)
        let calc = calculate(evalArr,evalArr[0],false,term)
        return calc
    }
}

let tokenize = (equation) =>{
    let formatted = remWhiteSpaces(equation)
    let tokenizedBrackets = tokenizeBrackets(formatted)
    let formattedArray = arrCombiner(tokenizedBrackets)
    return formattedArray
}

const combine_seq_arr = (arr) =>{
    const res = []
    try {
        if (typeof(arr) == "object") {
            arr.forEach(x=>{
                if(typeof(x) == "object"){
                    x.forEach(y=>{
                        res.push(y)
                    })
                }
    
                if (typeof(x) == "number") {
                    res.push(x)
                }
            })
        }
    } catch (error) {
        
    }

    return res
}

let compiler = (equation,terms) =>{
    let res = 0
    let setOpCode;
    let sequence = []
    for (let n = 1; n <= terms; n++) {
        let values = []
        tokenize(equation).forEach(el=>{
            if(el.includes("(")){
                if(setOpCode == undefined){
                    setOpCode = "ADD"
                }
                let calc = evalute(remBrackets(el),n)
                values.push(parseInt(compile(calc)))
                
            }
            if(!el.includes("(") && !opCodes.includes(el)){
                if(setOpCode == undefined){
                    setOpCode = "ADD"
                }
                if(!el.includes("n")){
                    values.push(parseInt(el))

                }else{
                    if(el.replace("n","") == ""){
                        values.push(n)
                        // console.log(values)

                    }else{
                        values.push(parseInt(el.replace("n",""))*n)
                    }
                }
            }
            
            if(opCodes.includes(el)){
                setOpCode = getOp(el)
                values.push(setOpCode)
                
            }
        })
        sequence.push(compile(values))
    }
    
    return combine_seq_arr(sequence)
}

compiler(eq1,10)

export {compiler}



