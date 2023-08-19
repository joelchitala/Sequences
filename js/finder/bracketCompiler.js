let eq = "(4n^2+3n*3+1)(n-1)"
let eq_1 = "(n-1)(n-2)(n-3)(n-4)"

let OPCODES = ["EVAL","BRKOP","BRKCL","PWR","MUL","DIV","ADD","SUB"]


const differential = (equation,index,operands) =>{
    let array = []
    if(typeof operands != "object"){
        return array;
    }
    for (let i = index; i < equation.length; i++) {
        const token = equation[i];
        
    }

    for (let i = index; i < equation.length; i++) {
        const token = equation[i];
        
    }

}
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

let getLastValOffset = (array,offset = 1) =>{
    return array[array.length - offset];
}

let getPrecidenceOpcode = (precidences,opCode) =>{
    for (let i = 0; i < precidences.length; i++) {
        const token = precidences[i];
        
        if(token.OPCODE == opCode){
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
    let decomposed_array_2 = []
    decomposed_array.forEach(x=>{
        let temp = []
        for (let i = 0; i < x.length; i++) {
            const token = x[i];
            if(x[0] == "ADD" || x[0] == "SUB"){
                if(token.includes("n") && !token.includes("^")){
                    if(token.split("n")[0] == ""){
                        temp.push("1"+token+"^1")
                    }else{
                        temp.push(token+"^1")
                    }
                }else{
                    temp.push(token)
                }
            }else{
                if(token.includes("-")){
                    temp.push("SUB")
                    temp.push(token.replace("-",""))
                }else{
                    temp.push("ADD")
                    temp.push(token)
                }

            }
        }
        decomposed_array_2.push(temp)
        
    })

    return decomposed_array_2
}

const isEven = (num) =>{
    if((num/2).toString().split(".")[1] == undefined){
        return true
    }else{
        return false
    }
}

const parse = (equation) =>{
    let array = []
    let string = ""
    let brackets = 0
    for (let i = 0; i < equation.length; i++) {
        const token = equation[i];
        if(token == ")"){
            brackets--

            if(string != "" && brackets != 0){
                array.push(string+")")
            }
            if(string != "" && brackets == 0 && string !=")"){
                array.push(string)
            }
            string = ""
            if(i+1 != equation.length && brackets == 0){
                string += "*"
            }
            if(string != ""){
                array.push(string)
            }

            string = ""
        }
        if(brackets > 0){
            string += token
        }
        if(token == "("){
            brackets++
        }
    }

    let res_1 = []
    array.forEach(value=>{
        let arr = []
        let str = ""
        let operands = ["+","-","*","/","(",")"]
        let sub_count = 0
        for (let i = 0; i < value.length; i++) {
            const token = value[i];
            if(sub_count > 0 && token != "-"){
                if(isEven(sub_count)){
                    arr.push("ADD")
                }else{
                    arr.push("SUB")
                }
                sub_count = 0
            }
            if(operands.includes(token)){
                

                if(str != ""){
                    arr.push(str)
                }

                str = ""
                if(i+1 != equation.length){
                    str += token
                }
                if(str != ""){
                    switch (token) {
                        case "+":
                            arr.push("ADD")
                            break;
                        case "-":
                            sub_count++
                            break;
                        case "*":
                            arr.push("MUL")
                            break;
                        case "/":
                            arr.push("DIV")
                            break;
                        case "^":
                            arr.push("PWR")
                            break;
                        case "(":
                            if(i-1 >= 0){
                                if(!operands.includes(value[i-1])){
                                    arr.push("MUL")
                                }
                                if(value[i-1] == ")"){
                                    arr.push("MUL")
                                }
                            }
                            arr.push("BRKOP")
                            break;
                        case ")":
                            arr.push("BRKCL")
                            if(i+1 != value.length){
                                if(!operands.includes(value[i+1])){
                                    arr.push("MUL")
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
                

                str = ""
            }else{
                if(i == 0 && !operands.includes(token)){
                    arr.push("ADD")
                }
                str += token
            }
        }
        if(sub_count > 0 && str!= "-"){
            if(isEven(sub_count)){
                arr.push("ADD")
            }else{
                arr.push("SUB")
            }
            sub_count = 0
        }
        if(str != ""){
            arr.push(str)
            str = ""
        }
        res_1.push(arr)
    });
    let res_2 = []
    let polarity = "ADD"
    let polared = false
    res_1.forEach(tokens=>{
        let temp = []
        let idx = 0
        tokens.forEach(token=>{
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
                    temp.push(polarity)
                    polared = false
                    polarity = "ADD"
                }

                temp.push(token)
            }
        })
        res_2.push(temp)
        temp = []
        idx++
    })

    return res_2
}

let compile = (array) =>{
    let result = []
    let decomposed_array = array

    let groups = []
    calculate_precidence(decomposed_array[0]).forEach(x=>{
        if(!groups.includes(x.group)){
            groups.push(x.group)
        }
    })
    groups = groups.sort().reverse()

    let res = decomposed_array[0]

    while(groups.length > 0){
        if(groups.length > 1){
        let precidences = calculate_precidence(res)
            let temp_array = []
            let skip = 0
            let index = 0
            res.forEach(token=>{
                if(OPCODES.includes(token) && getPrecidenceOpcode(precidences,token).group == getLastVal(groups)){
                    let pr;
                    switch(token){
                        case "EVAL":
                            pr = getPrecidenceIndex(precidences,index)
                            if(temp_array.length > 0){
                                let execute = compile([decomposed_array[res[pr.index+1]]])
                                execute.forEach(x=>{
                                    temp_array.push(x)
                                })
                            }
                            skip++
                            break;

                        case "MUL":
                            pr = getPrecidenceIndex(precidences,index)
                            if(temp_array.length > 0){
                                let num_1, num_2;
                                if(index != 0){
                                    num_1 = getLastVal(temp_array).toString()
                                    
                                    if(!OPCODES.includes(res[pr.index+1])){
                                        num_2 = res[pr.index+1]

                                    }
                                    if(num_2 != undefined){
                                        if(num_1.includes("n") && num_2.includes("n")){
                                            let power =  parseFloat(num_1.split("n")[1].replace("^",""))+parseFloat(num_2.split("n")[1].replace("^",""))
                                            let coef = parseFloat(num_1.split("n")[0].replace("^",""))*parseFloat(num_2.split("n")[0].replace("^",""))
                                            temp_array.pop()
                                            temp_array.push(coef+"n^"+power)
                                        }else{
                                            let partial_num, nonPartial_num;
                                            if(num_1.includes("n")){
                                                partial_num = num_1
                                                nonPartial_num = num_2
                                            }else if(num_2.includes("n")){
                                                partial_num = num_2
                                                nonPartial_num = num_1
                                            }
                                            if(num_1.includes("n") || num_2.includes("n")){
                                                let coef = parseFloat(partial_num.split("n")[0])*parseFloat(nonPartial_num.split("n")[0])
                                                temp_array.pop()
                                                temp_array.push(coef+"n"+partial_num.split("n")[1])
                                            }

                                            if(!num_1.includes("n") && !num_2.includes("n")){
                                                let coef = parseFloat(num_1)*parseFloat(num_2)
                                                temp_array.pop()
                                                temp_array.push(coef)
                                            }
                                            
                                        }
                                    }
                                }
                            }else{
                                if(index == 0){
                                    temp_array.push(res[pr.index+1])
                                }
                            }
                            skip++
                            break;

                        case "DIV":
                            pr = getPrecidenceIndex(precidences,index)
                            if(temp_array.length > 0){
                                let num_1, num_2;
                                if(index != 0){
                                    num_1 = getLastVal(temp_array).toString()
                                    
                                    if(!OPCODES.includes(res[pr.index+1])){
                                        num_2 = res[pr.index+1]

                                    }
                                    if(num_2 != undefined){
                                        if(num_1.includes("n") && num_2.includes("n")){
                                            let power =  parseFloat(num_1.split("n")[1].replace("^",""))-parseFloat(num_2.split("n")[1].replace("^",""))
                                            let coef = parseFloat(num_1.split("n")[0].replace("^",""))/parseFloat(num_2.split("n")[0].replace("^",""))
                                            temp_array.pop()
                                            temp_array.push(coef+"n^"+power)
                                        }else{
                                            let partial_num, nonPartial_num;
                                            if(num_1.includes("n")){
                                                partial_num = num_1
                                                nonPartial_num = num_2
                                            }else if(num_2.includes("n")){
                                                partial_num = num_2
                                                nonPartial_num = num_1
                                            }
                                            if(num_1.includes("n") || num_2.includes("n")){
                                                let coef = parseFloat(partial_num.split("n")[0])/parseFloat(nonPartial_num.split("n")[0])
                                                temp_array.pop()
                                                temp_array.push(coef+"n"+partial_num.split("n")[1])
                                            }

                                            if(!num_1.includes("n") && !num_2.includes("n")){
                                                let coef = parseFloat(num_1)/parseFloat(num_2)
                                                temp_array.pop()
                                                temp_array.push(coef)
                                            }
                                            
                                        }
                                    }
                                }
                            }else{
                                if(index == 0){
                                    temp_array.push(res[pr.index+1])
                                }
                            }
                            skip++
                            break;
                    }
                }else{
                    if(skip == 0){
                        temp_array.push(token)
                    }else{
                        skip--
                    }
                }
                index++
            })
            if(temp_array.length > 0){
                res = temp_array
            }
        }else{
            let precidences = calculate_precidence(res)
            let temp_array = []
            let skip = 0
            let index = 0
            res.forEach(token=>{
                if(OPCODES.includes(token) && getPrecidenceOpcode(precidences,token).group == getLastVal(groups)){
                    let pr;
                    switch(token){
                        case "EVAL":
                            pr = getPrecidenceIndex(precidences,index)
                            if(temp_array.length > 0){
                                // let execute = compile(decomposed_array[res[pr.index+1]])
                            }
                            skip++
                            break;

                        case "ADD":
                            pr = getPrecidenceIndex(precidences,index)

                            if(temp_array.length > 0){

                                let num_1, num_2;
                                if(index != 0){
                                    num_1 = getLastVal(temp_array).toString()
                                    if(!OPCODES.includes(res[pr.index+1])){
                                        if(res[pr.index+1] != undefined){
                                            num_2 = res[pr.index+1].toString()
                                        }
                                    }
                                    if(num_2 != undefined){
                                        if(num_1.includes("n") && num_2.includes("n")){
                                            if(num_1.split("n")[1] == num_2.split("n")[1]){
                                                temp_array.pop()
                                                let operand = getLastValOffset(temp_array)
                                                    if(operand == "SUB"){
                                                        temp_array.push(parseFloat(num_1.split("n")[0])-parseFloat(num_2.split("n")[0])+"n"+num_1.split("n")[1])
                                                    }else{
                                                        temp_array.push(parseFloat(num_1.split("n")[0])+parseFloat(num_2.split("n")[0])+"n"+num_1.split("n")[1])
                                                    }
                                            }else{
                                                temp_array.pop()
                                                temp_array.push(num_1)
                                                temp_array.push(token)
                                                temp_array.push(num_2)
                                            }
                                            
                                        }else{
                                            if(num_1.includes("^") || num_2.includes("^") ){
                                                if(num_1.split("^")[1] == num_2.split("^")[1]){
                                                    temp_array.pop()
                                                    temp_array.push(parseFloat(num_1.split("^")[0])+parseFloat(num_2.split("^")[0]))
                                                }else{
                                                    temp_array.pop()
                                                    temp_array.push(num_1)
                                                    temp_array.push(token)
                                                    temp_array.push(num_2)
                                                }
                                            }

                                            if(!num_1.includes("n") && !num_2.includes("n")){
                                                temp_array.pop()
                                                if(getLastVal(temp_array) == "SUB"){
                                                    temp_array.pop()
                                                    let num_res = -parseFloat(num_1)+parseFloat(num_2)
                                                    if(num_res < 0){
                                                        temp_array.push("SUB")
                                                    }else{
                                                        temp_array.push("ADD")
                                                    }
                                                    temp_array.push(num_res)
                                                }else{
                                                    temp_array.pop()
                                                    let num_res = parseFloat(num_1)+parseFloat(num_2)
                                                    temp_array.push("ADD")
                                                    temp_array.push(num_res)
                                                }
                                            }
                                        }
                                    }
                                }
                            }else{
                                if(index == 0){
                                    temp_array.push(res[pr.index+1])
                                }
                            }
                            
                            skip++
                            break;
                        
                        case "SUB":
                                pr = getPrecidenceIndex(precidences,index)
                                if(temp_array.length > 0){
                                    let num_1, num_2;
                                    
                                    if(index != 0){
                                        num_1 = getLastVal(temp_array).toString()
                                        if(!OPCODES.includes(res[pr.index+1])){
                                            num_2 = res[pr.index+1]
                                        }
                                        if(num_2 != undefined){
                                            
                                            if(num_1.includes("n") && num_2.includes("n")){
                                                if(num_1.split("n")[1] == num_2.split("n")[1]){
                                                    temp_array.pop()
                                                    let operand = getLastValOffset(temp_array)
                                                    if(operand == "SUB"){
                                                        temp_array.push(parseFloat(num_1.split("n")[0])+parseFloat(num_2.split("n")[0])+"n"+num_1.split("n")[1])
                                                    }else{
                                                        temp_array.push(parseFloat(num_1.split("n")[0])-parseFloat(num_2.split("n")[0])+"n"+num_1.split("n")[1])
                                                    }
                                                }else{
                                                    temp_array.pop()
                                                    temp_array.push(num_1)
                                                    temp_array.push(token)
                                                    temp_array.push(num_2)
                                                }

                                            }else{
                                                if(num_1.includes("^") || num_2.includes("^") ){
                                                    if(num_1.split("^")[1] == num_2.split("^")[1]){
                                                    
                                                        temp_array.pop()
                                                        temp_array.push(parseFloat(num_1.split("^")[0])+parseFloat(num_2.split("^")[0]))
                                                    }else{
                                                        temp_array.pop()
                                                        temp_array.push(num_1)
                                                        temp_array.push(token)
                                                        temp_array.push(num_2)
                                                    }
                                                }
                                                
                                            }

                                            if(!num_1.includes("n") && !num_2.includes("n")){
                                                temp_array.pop()
                                                if(getLastVal(temp_array) == "SUB"){
                                                    temp_array.push(-parseFloat(num_1)-parseFloat(num_2))
                                                }else{
                                                    temp_array.push(parseFloat(num_1)-parseFloat(num_2))
                                                }
                                            }
                                        }
                                    
                                    }
                                }else{
                                    if(index == 0){
                                        temp_array.push("-"+res[pr.index+1])
                                    }
                                }

                                skip++
                                break;
                            
                            default:
                                break;
                    
                            }

                        
                }else{
                    if(skip == 0){
                        temp_array.push(token)
                    }else{
                        skip--
                    }
                }
                index++


            });

            temp_array.forEach(x=>{
                result.push(x.toString())
            })
        }
        groups.pop()
    }

    return result
}

const multplex = (array,resurse = false,prev = []) =>{
    console.log(array);
    let result = []
    let arr,org;

    if(!resurse){
        arr = array
        org =array
    }else{
        org = array
        arr = prev
    }

    let length = 0

    arr.forEach(x=>{
        if(x.length> 1 || x[0].match("[0-9]") != null){
            length++
        }
    })
    length--

    let res = []
    let index = 0

    while(length > 0){
        let temp = []
        if(res.length == 0){
            if(index + 2 <= arr.length){
                let x_idx = 0
                arr[index].forEach(x=>{
                    let y_idx = 0
                    arr[index+2].forEach(y=>{

                        if(x_idx == 0 && y_idx == 0){
                            temp.push(["ADD",arr[index][0],"MUL",arr[index+2][0]])
                        }
                        if(OPCODES.includes(y) && !OPCODES.includes(x)){
                            let num = ""
                            switch(y){
                                case "ADD":
                                    num = ""+arr[index+2][y_idx+1]
                                    break;
                                case "SUB":
                                    num = "-"+arr[index+2][y_idx+1]
                                    break;
                            }
                            
                            if(arr[index][x_idx-1] == undefined){
                                temp.push(["ADD",x,"MUL",num])
                            }else{
                                let sub_num = ""
                                switch (arr[index][x_idx-1]) {
                                    case "ADD":
                                        sub_num = ""+x
                                        break;
                                    case "SUB":
                                        sub_num = "-"+x
                                        break;
                                }
                                // temp.push([sub_num,"MUL",num])
                                sub_num = ""
                            }
                            num = ""
                        }else if(!OPCODES.includes(y) && OPCODES.includes(x)){
                            let num = ""
                            switch(x){
                                case "ADD":
                                    num = ""+arr[index][x_idx+1]
                                    break;
                                case "SUB":
                                    num = "-"+arr[index][x_idx+1]
                                    break;
                            }
                            if(arr[index+2][y_idx-1] == undefined){
                                temp.push(["ADD",num,"MUL",y])
                            }else{
                                let sub_num = ""
                                switch (arr[index+2][y_idx-1]) {
                                    case "ADD":
                                        sub_num = ""+y
                                        break;
                                    case "SUB":
                                        sub_num = "-"+y
                                        break;
                                }
                                
                                temp.push(["ADD",num,"MUL",sub_num])
                                sub_num = ""
                            }
                            num = ""
                        }else if(!OPCODES.includes(y) && !OPCODES.includes(x) && !x.includes("n") && !y.includes("n")){
                            // console.log(arr[index])
                            // console.log(arr[index+2])
                            // console.log(x)
                            // console.log(y)
                        }
                        y_idx++
                    })
                    x_idx++
                })

            }
        }else{
            if(prev.length > 3){
                let temp_array_2 = []
                let rem_idx = [0,1,2]
                temp_array_2.push(result[0])
                for (let i = 0; i < prev.length; i++) {
                    if(!rem_idx.includes(i)){
                        temp_array_2.push(prev[i])
                    }
                }
                result.push(multplex(org,true,temp_array_2))
            }else{
                result.push(multplex(org,true,res))
            }
        }


        let temp_1 = []
        temp.forEach(x=>{
            decompose(compile(decompose(x))).forEach(y=>{
                y.forEach(z=>{
                    temp_1.push(z)
                })
            })
        })
        let executed = compile(decompose(temp_1))
        if(executed.length>0){
            result.push(executed)
        }
        index += 2
        if(index+2 < org.length){
            let results = compile(decompose(temp_1))
            if(results.length>0){
                res.push(results)
            }
            res.push(org[index+1])
            res.push(org[index+2])
        }

        length--
    }
    if(arr.length == 1){
        result.push(arr[0])
    }

    console.log(result);
    return getLastVal(result)
}

const getHighestPower = (array) =>{
    let pwr = 0

    array.forEach(token=>{
        if(token.includes("n")){
            let coef = parseFloat(token.split("^")[1])
            if(pwr < coef){
                pwr = coef
            }
        }
    })
    return pwr
}
const scanner = (array) =>{
    let pwr = getHighestPower(array)
    let results = []
    let index = 0
    while(pwr > 0){
        let idx = 0
        let temp = []
        array.forEach(token=>{
            if(token.includes("n")){
                let coef = parseFloat(token.split("^")[1])
                if(coef == pwr){
                    if(idx == 0){
                        temp.push("ADD")
                        temp.push(token)
                    }else{
                        temp.push(array[idx-1])
                        temp.push(token)
                    }
                }
                
            }
            idx++
        })
        let num = compile(decompose(temp))[0]
        if(num != undefined){
            if(num.includes("-")){
                results.push(num)
            }else{
                if(index != 0){
                    if(parseFloat(num.split("n")[0]) != 0 ){
                       
                        if(!num.includes("+")){
                            results.push(num)
                        }else{
                            results.push("+"+num)
                        }
                    }
                }else{
                    results.push(num)
                }
            }
        }
        

        pwr--
        let idx_1 = 0
        array.forEach(token=>{
            if(!token.includes("n") && !OPCODES.includes(token) && pwr == 0){
                if(array[idx_1-1] == "SUB"){
                    let num;
                    if(getLastVal(results) != NaN){
                        // num = parseFloat(getLastVal(results)) + parseFloat(token);
                        console.log()
                    }
                    if(num == undefined){
                        results.push("-"+token)
                    }else{
                        results.pop()
                        
                         results.push(""+num)
                            
                    }

                }else if(array[idx_1-1] == "ADD"){
                    let num;
                    if(!getLastVal(results).includes("n")){
                        if(getLastVal(results) != NaN){
                            // num = parseFloat(getLastVal(results)) + parseFloat(token);
                        }
                    }
                    if(num == undefined){
                        
                        if(token.includes("+")){
                            results.push(token)
                        }else{
                            results.push("+"+token)
                        }
                    }else{
                        results.pop()
                        if(num != 0){

                        
                            if(num < 0){
                                results.push(""+num)
                            }else{
                                results.push("+"+num)
                            }
                        }
                        
                    }
                    

                }

            }
            
            idx_1++
        })

        index++
    }
    
    return results
}


let open_brackets = (equation,toString = false) =>{
    let array = parse(equation)
    let array_2 = []
    array.forEach(x=>{
        if(x.length>1){
            array_2.push(compile(decompose(x)))
        }else{
            array_2.push(x)
        }
    })
    
    // console.log(multplex(array_2));
    if(toString){
        return scanner(multplex(array_2)).toString().replaceAll(",","")
    }else{
        return scanner(multplex(array_2))
    }
}

// main(eq_1)
// console.log(open_brackets("(n-1)(n-2)(n-3)(n-4)",true))
// main("(4+10+4)")

export {open_brackets ,multplex,decompose, scanner}


