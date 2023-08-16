
import { sequenceFormula, traverse} from "./js/finder/traverseCompiler.js";
import { compiler } from "./js/generator/genSeq.js";

const new_sequence_btn = document.querySelector("#new-sequence")

const sidebar = document.querySelector("#sidebar")

const open_sidebar = document.querySelector("#open-sidebar")

const close_sidebar = document.querySelector("#close-sidebar")

const sequence_history = document.querySelector("#sequence-history")
const canvas = document.querySelector("#canvas")

const reset_history_box = () =>{
    const history_boxes = [...sequence_history.children]
    history_boxes.forEach(x =>{
        x.querySelector(".ctr-1").style = "display: none;"
        x.querySelector(".ctr-2").style = "display: none;"
        x.classList.remove("active-history")
        const title = x.querySelector(".title")
        title.removeAttribute("contenteditable")
    })
}

open_sidebar.onclick = (e) =>{
    sidebar.style.display = "block"
}

close_sidebar.onclick = (e) =>{
    sidebar.style.display = "none"
}

new_sequence_btn.onclick = (e) =>{


    const sequence_history_box = document.createElement("div")

    sequence_history_box.classList.add("sequence-history-box")

    sequence_history_box.innerHTML = `
        <p class="title">######</p>
        <div class="controls ctr-1" style="display: none;">
            <i class='bx bx-trash trash-btn'></i>
            <i class='bx bx-edit-alt edit-btn'></i>
        </div>
        <div class="controls ctr-2" style="display: none;">
            <i class='bx bx-x cancel-btn'></i>
            <i class='bx bx-check check-btn'></i>
        </div>
    `

    const title = sequence_history_box.querySelector(".title")

    const trash_btn = sequence_history_box.querySelector(".trash-btn")

    trash_btn.onclick = (e) =>{
        sequence_history.removeChild(sequence_history_box)
    }

    const edit_btn = sequence_history_box.querySelector(".edit-btn")

    edit_btn.onclick = (e) =>{
        sequence_history_box.querySelector(".ctr-1").style = "display: none;"
        sequence_history_box.querySelector(".ctr-2").style = "display: flex;"

        title.setAttribute("contenteditable","true")
        title.focus()
        sequence_history_box.setAttribute("data-prev",title.innerText)

        e.preventDefault()
        e.stopPropagation()
    }


    const check_btn = sequence_history_box.querySelector(".check-btn")

    check_btn.onclick = (e) =>{
        sequence_history_box.querySelector(".ctr-1").style = "display: flex;"
        sequence_history_box.querySelector(".ctr-2").style = "display: none;"
        title.removeAttribute("contenteditable")
        title.focus()

        e.preventDefault()
        e.stopPropagation()
    }

    const cancel_btn = sequence_history_box.querySelector(".cancel-btn")

    cancel_btn.onclick = (e) =>{
        sequence_history_box.querySelector(".ctr-1").style = "display: flex;"
        sequence_history_box.querySelector(".ctr-2").style = "display: none;"
        title.removeAttribute("contenteditable")
        const prev = sequence_history_box.getAttribute("data-prev")

        title.innerText = prev

        e.preventDefault()
        e.stopPropagation()
    }

    sequence_history_box.onclick = (e) =>{
        reset_history_box()

        sequence_history_box.querySelector(".ctr-1").style = "display: flex;"
        sequence_history_box.classList.add("active-history")

        canvas.innerHTML = `
        <div class="sequence-folder">
            <h2>${title.innerText}</h2>
            <div id="canvas-controls">
                <div id="add-solver">
                    <i class='bx bx-plus'></i>
                    <p>Add Sequence Finder</p>
                </div>
                <div class = "vertical"></div>
                <div id="add-generator">
                    <i class='bx bx-plus'></i>
                    <p>Add Sequence Generator</p>
                </div>
            </div>
            <div id="sequence-container">

            </div>
        </div>
        `

        const sequence_container = canvas.querySelector("#sequence-container")


        const add_solver_btn = canvas.querySelector("#add-solver")
        add_solver_btn.onclick = (e) =>{

            const sequence_box = document.createElement("div")

            sequence_box.classList.add("sequence-box")
            sequence_box.classList.add("solver")

            sequence_box.setAttribute("data-set",false)

            sequence_box.innerHTML += `
                <h3>Sequence Finder</h3>
                <div class="top-section">
                    <label for="terms-input">Terms formula</label>
                    <input class="terms-input" name="terms-input" type="text" placeholder="2 , 4 , 6 , 8 , 10 , 12">
                    <button class="sumbit">Solve</button>
                    <i class='bx bxs-down-arrow' id="down-arrow"></i>
                </div>
                <div class="bottom-section" style="display: none;">
                    <h4>Results</h4>
                    <p class="closed-form"></p>
                    <h4>Tree Diagram</h4>
                    <div class="tree-container">
                        
                    </div>
                </div>
            `

            const terms_input = sequence_box.querySelector(".terms-input")

            const closed_form = sequence_box.querySelector(".closed-form")

            const tree_container = sequence_box.querySelector(".tree-container")


            const sumbit = sequence_box.querySelector(".sumbit")

            sumbit.onclick = (e) =>{

                let array = []

                if(terms_input.value != ""){
                    terms_input.value.split(",").forEach(num=> {
                        array.push(parseInt(num))
                    });
                    terms_input.setAttribute("disabled",true)
                    sumbit.setAttribute("disabled",true)

                    
                }else{
                    return
                }

                if(array.length > 0){
                    closed_form.innerText = `Closed Form: `+sequenceFormula(array)
                }else{
                    return
                }

                const trav = traverse(array)

                tree_container.innerHTML = ""
                trav.forEach(x =>{
                    let str_1 = ""
                    
                    x.forEach(y=>{
                        str_1 += `
                        <div><p>${y}</p></div>
                        `
                    })

                    let str_2 = `
                    <div class="tree-layer">
                        ${str_1}
                    </div>
                    `
                    tree_container.innerHTML += str_2
                })
                
            }

            const bottom_section = sequence_box.querySelector(".bottom-section")

            const down_arrow_btn = sequence_box.querySelector("#down-arrow")

            down_arrow_btn.onclick = (e) =>{
                if (bottom_section.style.display == "none") {
                    bottom_section.style.display = "flex"
                }else{
                    bottom_section.style.display = "none"
                }
            }

            sequence_container.appendChild(sequence_box)
            
        }


        const add_generator_btn = canvas.querySelector("#add-generator")
        
        add_generator_btn.onclick = (e) =>{
            const sequence_box = document.createElement("div")

            sequence_box.classList.add("sequence-box")
            sequence_box.classList.add("solver")

            sequence_box.setAttribute("data-set",false)

            sequence_box.innerHTML += `
                <h3>Sequence Generator</h3>
                <div class="top-section">
                    <label for="equation-input">Equation formula</label>
                    <input class="equation-input" name="equation-input" type="text" placeholder="3n^2 + 4">
                    <label for="terms-input">Numeber Terms</label>
                    <input class="terms-input" name="terms-input" type="number" min="1" value="1">
                    <button class="sumbit">Generate</button>
                    <i class='bx bxs-down-arrow' id="down-arrow"></i>
                </div>
                <div class="bottom-section" style="display: none;">
                    <h4>Results</h4>
                    <p class="generated-terms"></p>
                    <h4>Tree Diagram</h4>
                    <div class="tree-container">
                        
                    </div>
                </div>
            `

            const equation_input = sequence_box.querySelector(".equation-input")

            const terms_input = sequence_box.querySelector(".terms-input")

            const generated_terms = sequence_box.querySelector(".generated-terms")

            const tree_container = sequence_box.querySelector(".tree-container")


            const sumbit = sequence_box.querySelector(".sumbit")

            sumbit.onclick = (e) =>{

                let array = []

                const eq = equation_input.value
                let terms = terms_input.value 

                if(eq!= "" && terms!= ""){

                    terms = parseInt(terms)

                    const res = compiler(eq,terms)

                    generated_terms.innerText = `Generated Terms: [ ${res} ]`

                    res.forEach(num=> {
                        array.push(parseInt(num))
                    });

                    equation_input.setAttribute("disabled",true)
                    terms_input.setAttribute("disabled",true)
                    sumbit.setAttribute("disabled",true)

                    
                }else{
                    return
                }

                if(array.length == 0){
                    return
                }

                const trav = traverse(array)

                tree_container.innerHTML = ""
                trav.forEach(x =>{
                    let str_1 = ""
                    
                    x.forEach(y=>{
                        str_1 += `
                        <div><p>${y}</p></div>
                        `
                    })

                    let str_2 = `
                    <div class="tree-layer">
                        ${str_1}
                    </div>
                    `
                    tree_container.innerHTML += str_2
                })
                
            }

            const bottom_section = sequence_box.querySelector(".bottom-section")

            const down_arrow_btn = sequence_box.querySelector("#down-arrow")

            down_arrow_btn.onclick = (e) =>{
                if (bottom_section.style.display == "none") {
                    bottom_section.style.display = "flex"
                }else{
                    bottom_section.style.display = "none"
                }
            }

            sequence_container.appendChild(sequence_box)
        }

        e.preventDefault()
        e.stopPropagation()
    }

    sequence_history.appendChild(sequence_history_box)
}

window.onclick = (e) =>{
    reset_history_box()
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

// console.log(combine_seq_arr(compiler("",10)));

