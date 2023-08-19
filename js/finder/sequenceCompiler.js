let OPCODES = ["EVAL","BRKOP","BRKCL","PWR","MUL","DIV","ADD","SUB"]

const calculate_precidence = (values) =>{
    let array = []
    let index = 0
    if(typeof values == "object"){
        values.forEach(opcode => {
            if(OPCODES.includes(opcode)){
                switch(opcode){
                    case "EVAL":
                        array.push({index:index,group:0,OPCODE:opcode})
                    break;
    
                    case "PWR":
                        array.push({index:index,group:1,OPCODE:opcode})
                    break;
    
                    case "MUL":
                        array.push({index:index,group:2,OPCODE:opcode})
                        break;
                
                    case "DIV":
                        array.push({index:index,group:2,OPCODE:opcode})
                        break;
            
                    case "ADD":
                        array.push({index:index,group:3,OPCODE:opcode})
                        break;
            
                    case "SUB":
                        array.push({index:index,group:3,OPCODE:opcode})
                        break;
                    default:
                        break;
                }
            }
            index++
        });
    }
    return array
}

const decompose = (values) =>{
    let decomposed_array = []
    let index = 0
    let recurse = 1
    while(recurse>0){
        recurse--
        if(index == 0){
            let temp_array = []
            let temp_array_2 = []
            let temp_array_3 = []
            let brackets = 0
            if(typeof values == "object"){
                values.forEach(value => {
                    if(value == "BRKCL"){
                        brackets--
                        if(brackets == 0){
                            index++
                            temp_array.push("EVAL")
                            temp_array.push(index)
                            if(temp_array_2.length>0){
                                temp_array_3.push(temp_array_2)
                            }
                            temp_array_2 = []
                        }
                        recurse = 1
                    }
                    if(brackets > 0){
                        temp_array_2.push(value)
                    }
                    
                    if(value == "BRKOP"){
                        brackets++
                    }
                    if(brackets == 0){
                        if(value != "BRKOP" && value != "BRKCL"){
                            temp_array.push(value)
                        }
                    }
                });
                decomposed_array.push(temp_array)
                if(temp_array_3.length>0){
                    temp_array_3.forEach(x=>{
                        decomposed_array.push(x)
                    })
                }
            }
            
        }else{
            for (let i = 1; i < decomposed_array.length; i++) {
                const vals = decomposed_array[i];
                let temp_array = []
                let temp_array_2 = []
                let temp_array_3 = []
                let brackets = 0
                for (let j = 0; j < vals.length; j++) {
                    const value = vals[j];
                    if(value == "BRKCL"){
                        brackets--
                        if(brackets == 0){
                            index++
                            temp_array.push("EVAL")
                            temp_array.push(index)
                            if(temp_array_2.length>0){
                                temp_array_3.push(temp_array_2)
                            }
                            temp_array_2 = []
                        }
                    }
                    if(brackets > 0){
                        temp_array_2.push(value)
                    }
                    
                    if(value == "BRKOP"){
                        brackets++
                    }
                    if(brackets == 0){
                        if(value != "BRKOP" && value != "BRKCL"){
                            temp_array.push(value)
                        }
                    }
                }
                if(temp_array.length > 0){
                    decomposed_array[i] = temp_array
                }
                if(temp_array_3.length>0){
                    temp_array_3.forEach(x=>{
                        decomposed_array.push(x)
                    })
                }
            }
        }
    }
    return decomposed_array
}

const exec = (val_1,opCode,val_2) =>{
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

const replaceValues = (array,indexes,values) =>{
    if(typeof array != "object" && typeof indexes != "object" && typeof values != "object" && values.length > indexes.length){
        return null;
    }
    let replaced = []
    let replace_idx = indexes.length
    for (let i = 0; i < array.length; i++) {
        const token = array[i];
        if(indexes.includes(i)){
            replace_idx--
        }
        if(replace_idx == 0){
            values.forEach(value=>{
                replaced.push(value)
            })
            replace_idx = -1
        }

        if(!indexes.includes(i)){
            replaced.push(token)
        }
    }
    return replaced
}

let getLastVal = (array) =>{
    return array[array.length - 1];
}

let getPrecidenceOpcode = (precidences,opCode) =>{
    for (let i = 0; i < precidences.length; i++) {
        const token = precidences[i];
        
        if(token.opCode == opCode){
            return token;
        }
    }
    return null;
}

let getPrecidenceIndex = (precidences,index) =>{
    for (let i = 0; i < precidences.length; i++) {
        const token = precidences[i];
        
        if(token.index == index){
            return token;
        }
    }
    return null;
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

let isEven = (num) =>{
    console.log()
    if((num/2).toString().split(".")[1] == undefined){
        return true
    }else{
        return false
    }
}

let differenceArray = (array_1,array_2) =>{
    let arr_1 = array_1
    let arr_2 = array_2

    if(array_1.length > array_2.length){
        for (let i = 0; i < array_2.length - array_1.length; i++) {
            arr_1.push(null)
        }
    }else{
        for (let i = 0; i < array_1.length - array_2.length; i++) {
            arr_2.push(null)
        }
    }
    let difference = []

    for (let i = 0; i < arr_1.length; i++) {
        if(arr_1[i] != arr_2[i]){
            let data_1 = {
                index:i,
                value:arr_1[i],
            }
            let data_2 = {
                index:i,
                value:arr_2[i],
            }
            difference.push({array_1:data_1,array_2:data_2})
        }
    }

    console.log(difference)
}

const parser = (string,term = 1) =>{
    let operands = ["+","-","*","/","^","(",")"]
    let parsed_array = []
    let num_string = ""
    let sub_count = 0
    for (let n = 0; n < string.length; n++) {
        const token = string[n];
        if(operands.includes(token)){
            if(num_string.includes("n")){
                let split = num_string.split("n")
                if(split[0] != "" && !operands.includes(split[0])){
                    parsed_array.push(parseFloat(split[0])*term)
                }else{
                    parsed_array.push(term)
                }
            }else{
                if(num_string != ""){
                    parsed_array.push(parseFloat(num_string))
                }
            }
            if(sub_count > 0 && token != "-"){
                if(isEven(sub_count)){
                    parsed_array.push("ADD")
                }else{
                    parsed_array.push("SUB")
                }
                sub_count = 0
            }
            switch (token) {
                case "+":
                    parsed_array.push("ADD")
                    break;
                case "-":
                    sub_count++
                    break;
                case "*":
                    parsed_array.push("MUL")
                    break;
                case "/":
                    parsed_array.push("DIV")
                    break;
                case "^":
                    parsed_array.push("PWR")
                    break;
                case "(":
                    if(n-1 >= 0){
                        if(!operands.includes(string[n-1])){
                            parsed_array.push("MUL")
                        }
                        if(string[n-1] == ")"){
                            parsed_array.push("MUL")
                        }
                    }
                    parsed_array.push("BRKOP")
                    break;
                case ")":
                    parsed_array.push("BRKCL")
                    if(n+1 != string.length){
                        if(!operands.includes(string[n+1])){
                            parsed_array.push("MUL")
                        }
                    }
                    break;
                default:
                    break;
            }
            num_string = ""
        }else{
        
            if(sub_count > 0 && token != "-"){
                if(isEven(sub_count)){
                    parsed_array.push("ADD")
                }else{
                    parsed_array.push("SUB")
                }
                sub_count = 0
            }
            
            num_string += token
        }
    }
    if(num_string != ""){
        if(num_string.includes("n")){
            let split = num_string.split("n")
            if(split[0] != "" && !operands.includes(split[0])){
                parsed_array.push(parseFloat(split[0])*term)
            }else{
                parsed_array.push(term)
            }
        }else{
            if(num_string != ""){
                parsed_array.push(parseFloat(num_string))
            }
        }
        num_string = ""
    }

    let parsed_array_2 = []
    let polarity = "ADD"
    let polared = false
    let index = 0
    parsed_array.forEach(token=>{
        if(token == "SUB"){
            if(polarity == "SUB"){
                polarity = "ADD"
            }else{
                polarity = "SUB"
            }
            polared = true
        }
        if(token == "ADD"){
            polared = true
        }
        if(token != "ADD" && token != "SUB"){
            if(polared){
                parsed_array_2.push(polarity)
                polared = false
                polarity = "ADD"
            }
            parsed_array_2.push(token)
        }
        index++
    })
    return parsed_array_2
}

const compile = (values,stacks = [],recurse = false) =>{
    let result = 0
    let stack = decompose(values)
    let origin = stacks
    let groups = []
    calculate_precidence(stack[0]).forEach(x=>{
        if(!groups.includes(x.group)){
            groups.push(x.group)
        }
    })
    groups = groups.sort().reverse()

    if(groups.length == 0){
        if(stack.length > 0){
            result = stack[0][0]
        }
    }
    let res = stack[0]
    while(groups.length > 0){
        if(groups.length > 1){
            let precidences = calculate_precidence(res)
            let index = 0
            let pr;
            let temp_array = []
            let skip = 0
            res.forEach(value=>{
                if(OPCODES.includes(value) && getPrecidenceIndex(precidences,index).group == getLastVal(groups)){
                    let execute;
                    switch(value){
                        case "MUL":
                            pr = getPrecidenceIndex(precidences,index)

                            if(temp_array.length > 0){
                                let num = getLastVal(temp_array)
                                let num_2;
                                if(res[pr.index+1] == "SUB"){
                                    num_2 = exec(0,"SUB",res[pr.index+2])
                                }else if(res[pr.index+1] == "ADD"){
                                    num_2 = res[pr.index+2]
                                }else{
                                    num_2 = res[pr.index+1]
                                }

                                execute = exec(num,value,num_2)
                                temp_array.pop()
                                temp_array.push(execute)
                            }

                            
                            skip++
                            break;
                            
                        case "DIV":
                            pr = getPrecidenceIndex(precidences,index)
                            
                            if(temp_array.length > 0){
                                let num = getLastVal(temp_array)
                                let num_2;
                                if(res[pr.index+1] == "SUB"){
                                    num_2 = exec(0,"SUB",res[pr.index+2])
                                }else if(res[pr.index+1] == "ADD"){
                                    num_2 = res[pr.index+2]
                                }else{
                                    num_2 = res[pr.index+1]
                                }
                                execute = exec(num,value,num_2)
                                temp_array.pop()
                                temp_array.push(execute)
                            }
                            skip++
                            break;

                        case "PWR":
                            pr = getPrecidenceIndex(precidences,index)
                            if(temp_array.length > 0){
                                let num = getLastVal(temp_array)
                                let num_2;
                                if(res[pr.index+1] == "SUB"){
                                    num_2 = exec(0,"SUB",res[pr.index+2])
                                }else if(res[pr.index+1] == "ADD"){
                                    num_2 = res[pr.index+2]
                                }else{
                                    num_2 = res[pr.index+1]
                                }
                                execute = exec(num,value,num_2)
                                temp_array.pop()
                                temp_array.push(execute)
                            }
                            skip++
                            break;
                            
                        case "EVAL":
                            pr = getPrecidenceIndex(precidences,index)
                            if(recurse){
                                execute = compile(origin[res[pr.index+1]],origin,true)
                                temp_array.push(execute)
                            }else{
                                execute = compile(stack[res[pr.index+1]],stack,true)
                                temp_array.push(execute)
                            }
                            
                            skip++
                            break;
                    }
                }else{
                    if(skip == 0){
                        temp_array.push(value)
                    }else{
                        skip--
                    }
                }
                index++
            })

            if(temp_array.length > 0){
                res = temp_array
                temp_array = []
            }
            
        }else{
            let precidences = calculate_precidence(res)
            let index = 0
            let pr;
            res.forEach(value=>{
                if(index == 0 && !OPCODES.includes(value)){
                    result = value
                }
                if(OPCODES.includes(value) && getPrecidenceIndex(precidences,index).group == getLastVal(groups)){
                    switch(value){
                        case "ADD":
                            pr = getPrecidenceIndex(precidences,index)
                            
                            if(pr.index == 0){
                                let execute;
                                if(res[pr.index+1] == "ADD"){
                                    execute = exec(0,"ADD",res[pr.index+2])
                                }else if(res[pr.index+1] == "SUB"){
                                    execute = exec(0,"SUB",res[pr.index+2])
                                }else{
                                    execute = exec(0,pr.OPCODE,res[pr.index+1])
                                }
                                result = execute
                            }else{
                                let execute;
                                if(res[pr.index+1] == "ADD"){
                                    execute = exec(0,"ADD",res[pr.index+2])
                                }else if(res[pr.index+1] == "SUB"){
                                    execute = exec(0,"SUB",res[pr.index+2])
                                }else{
                                    execute = exec(result,pr.OPCODE,res[pr.index+1])
                                }
                                result = execute
                            }
                            break;
                        case "SUB":
                            pr = getPrecidenceIndex(precidences,index)
                            if(pr.index == 0){
                                let execute;
                                if(res[pr.index+1] == "ADD"){
                                    execute = exec(0,"SUB",res[pr.index+2])
                                }else if(res[pr.index+1] == "SUB"){
                                    execute = exec(0,"ADD",res[pr.index+2])
                                }else{
                                    execute = exec(0,pr.OPCODE,res[pr.index+1])
                                }

                                result = execute
                            }else{
                                let execute;

                                if(res[pr.index+1] == "ADD"){
                                    execute = exec(0,"SUB",res[pr.index+2])
                                }else if(res[pr.index+1] == "SUB"){
                                    execute = exec(0,"ADD",res[pr.index+2])
                                }else{
                                    execute = exec(result,pr.OPCODE,res[pr.index+1])
                                }
                                result = execute
                            }
                            break;
                        case "MUL":
                            pr = getPrecidenceIndex(precidences,index)
                            if(pr.index == 0){
                                let execute = exec(1,pr.OPCODE,res[pr.index+1])
                                result = execute
                            }else{
                                let execute = exec(result,pr.OPCODE,res[pr.index+1])
                                result = execute
                            }
                            break;
                        case "DIV":
                            pr = getPrecidenceIndex(precidences,index)
                            if(pr.index == 0){
                                let execute = exec(res[pr.index+1],pr.OPCODE,1)
                                result = execute
                            }else{
                                let execute = exec(result,pr.OPCODE,res[pr.index+1])
                                result = execute
                            }
                            break;
                        case "PWR":
                            pr = getPrecidenceIndex(precidences,index)
                            if(pr.index != 0){
                                let execute = exec(result,pr.OPCODE,res[pr.index+1])
                                result = execute
                            }
                            break;
                        case "EVAL":
                            pr = getPrecidenceIndex(precidences,index)
                            if(recurse){
                                let execute = compile(origin[res[pr.index+1]],origin,true)
                                if(result == 0){
                                    let execute_2 = exec(1,"MUL",execute)
                                    result = execute_2
                                }else{
                                    let execute_2 = exec(result,"MUL",execute)
                                    result = execute_2   
                                }
                            }else{
                                let execute = compile(stack[res[pr.index+1]],stack,true)
                                if(result == 0){
                                    let execute_2 = exec(1,"MUL",execute)
                                    result = execute_2
                                }else{
                                    let execute_2 = exec(result,"MUL",execute)
                                    result = execute_2   
                                }
                            }
                            break;
                        default:
                            result = 0
                            break;
                    }
                }
                index++
            })
        }
        groups.pop()
    }

    return result
}


const main = (string,terms = 1) =>{
    let sequence_array = []
    for (let n = 1; n <= terms; n++) {
        let parsed_string_array = parser(remWhiteSpaces(string),n)
        sequence_array.push(compile(parsed_string_array))
    }

    return sequence_array
}

// console.log(main("((n-1)(-1)^(n+1))+(-1)^n((n-1)((3+(-1)^n)/2)+((n-2)^2((-1)^(n+1))+(n-2))/(2n-6+(1+(-1)^(n-1))))+2",2))


export {main}
