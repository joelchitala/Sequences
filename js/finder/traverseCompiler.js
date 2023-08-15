import { decompose, multplex, open_brackets, scanner } from "./bracketCompiler.js"
import { main } from "./sequenceCompiler.js"

let linear_seq = [1,2,3,4,5,6,7]
let quad_seq = [1,4,9,16,25,36]
let cubic_seq = [1,8,27,64,125,216]

let OPCODES = ["EVAL","BRKOP","BRKCL","PWR","MUL","DIV","ADD","SUB"]

const checkIfConstant = (sequence) =>{
    let diff = []

    for (let i = 0; i < sequence.length; i++) {
        const num = sequence[i];
        if(i+1 != sequence.length){
            diff.push(sequence[i+1] - num)
            if(diff.length == 2){
                if(diff[i] - diff[i-1] != 0){
                    return false
                }
            }
        }
    }
    
    return true
}

const traverse = (sequence) =>{
    let traversed = []

    traversed.push(sequence)

    let recurse = 1
    let index = 0
    let diff = []

    while(recurse > 0){
        let i = 0
        traversed[index].forEach(num => {
            if(i+1 != traversed[index].length){
                diff.push(traversed[index][i+1] - num)
            }
            i++
        });

        if(diff.length > 0){
            traversed.push(diff)
            diff = []
        }
        if(traversed[index] != undefined){
            if (traversed[index].length < 2) {
                recurse = 0
            }
            if(!checkIfConstant(traversed[index])){
                index++
                recurse++
            }
        }
        recurse--
    }

    return traversed
}

const factorial = (number) =>{
    let result = 1

    if(number == 0 || number == 1) result = 1;

    if(number > 1){
        for (let i = 1; i <= number; i++) {
            result *= i          
        }
    }

    return result
}


const sequenceFormula = (sequence) =>{
    let array = traverse(sequence)

    let product_rule = ""
    let i = 0

    let equate = `${array[0][0]}`

    let array_2 = []
    array.forEach(x=>{
        if(i != 0){
            product_rule += `(n-${i})`
            let num = parseInt(x[0])/factorial(i)
            array_2.push(open_brackets(`(${num})`+`${product_rule}`))

            equate += ` + (${num})`+`${product_rule}`
        } 
        i++
    })
    let array_3 = []

    array_3.push("ADD")
    array_3.push(""+array[0][0])
    array_2.forEach(x=>{
        decompose(x)[0].forEach(token=>{
            array_3.push(token)
            
        })
    })
    let array_4 = []
    let idx = 0
    scanner(array_3).forEach(z=>{
            if(!z.includes("-") && !z.includes("+")){
                if(idx == 0){
                    
                    if(parseInt(z.split("n")[0]) == 1){
                        let str = ""
                        for (let i = 1; i < z.length; i++) {
                            const token = z[i];
                            str += token
                        }
                        array_4.push(str)
                        str = ""

                    }else{
                        array_4.push(z)
                    }
                }else{
                    let str = ""
                    if(parseInt(z.split("n")[0]) == 1 || parseInt(z.split("n")[0]) == -1 ){
                        for (let i = 1; i < z.length; i++) {
                            const token = z[i];
                            str += token
                        }
                    }else{
                        for (let i = 0; i < z.length; i++) {
                            const token = z[i];
                            str += token
                        }
                    }
                    
                        
                        array_4.push("+ "+str)
                        str = ""
                }
                
            }else{
                if(parseInt(z) != 0){
                    if(parseInt(z) == -1 || parseInt(z) == 1 && z.includes("n")){
                        array_4.push(z.replace("1",""))
                    }else{
                        array_4.push(z)
                    }

                }
            }
            
        idx++
    })

    let array_5 = []
    let temp_arr = ""
    array_4.forEach(x=>{
        if(x.includes("n")){
            if(parseInt(x.split("^")[1]) == 1){
            array_5.push(x.split("^")[0])
            }else{
            array_5.push(x)
            }
        }else{
            temp_arr += x
        }
    })
    let constant = main(temp_arr)[0]
    if(constant > 0){
        array_5.push("+"+constant)
    }else if(constant < 0){
        array_5.push(""+constant)
    }

    return array_5.toString().replaceAll(","," ")
}

export{sequenceFormula, traverse}
