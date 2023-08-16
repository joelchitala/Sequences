const OPCODES = {
    EVAL: "EVAL",
    BRKOP: "BRKOP",
    BRKCL: "BRKCL",
    PWR: "PWR",
    DIV: "DIV",
    MUL: "MUL",
    SUB: "SUB",
    ADD: "ADD",
  };
  
function getOpcodes() {
    return Object.values(OPCODES);
}

function isOpcode(opcode) {
    return getOpcodes().includes(opcode);
}

const OPERANDS = ["+", "-", "*", "/", "^", "(", ")"];

function calcPrecidence(decomposed) {
    const array = [];
    let index = 0;
    for (const opcode of decomposed) {
        switch (opcode) {
        case OPCODES.EVAL:
            array.push({ index, group: 0, OPCODE: opcode });
            break;
        case OPCODES.BRKOP:
            array.push({ index, group: 1, OPCODE: opcode });
            break;
        case OPCODES.BRKCL:
            array.push({ index, group: 1, OPCODE: opcode });
            break;
        case OPCODES.PWR:
            array.push({ index, group: 2, OPCODE: opcode });
            break;
        case OPCODES.DIV:
            array.push({ index, group: 3, OPCODE: opcode });
            break;
        case OPCODES.MUL:
            array.push({ index, group: 3, OPCODE: opcode });
            break;
        case OPCODES.ADD:
            array.push({ index, group: 4, OPCODE: opcode });
            break;
        case OPCODES.SUB:
            array.push({ index, group: 4, OPCODE: opcode });
            break;
        }
        index += 1;
    }
    return array;
}
  
function getPrecidenceOpcode(opcode) {
    switch (opcode) {
        case OPCODES.EVAL:
        return { group: 0, OPCODE: opcode };
        case OPCODES.BRKOP:
        return { group: 1, OPCODE: opcode };
        case OPCODES.BRKCL:
        return { group: 1, OPCODE: opcode };
        case OPCODES.PWR:
        return { group: 2, OPCODE: opcode };
        case OPCODES.DIV:
        return { group: 3, OPCODE: opcode };
        case OPCODES.MUL:
        return { group: 3, OPCODE: opcode };
        case OPCODES.ADD:
        return { group: 4, OPCODE: opcode };
        case OPCODES.SUB:
        return { group: 4, OPCODE: opcode };
        default:
        return null;
    }
}

function getPrecidenceIndex(array, index) {
    for (const x of array) {
      if (x.index === index) {
        return x;
      }
    }
    return null;
}

function isSorted(array) {
    for (let index = 0; index < array.length - 1; index++) {
        if (array[index] > array[index + 1]) {
        return false;
        }
    }
    return true;
}

function sorter(array, reverse = false, distinct = false) {
    let sortedArray = [...array];

    let recurse = 1;
    while (recurse > 0) {
        const tempArray = [];
        let index = 0;

        if (sortedArray.length >= 1) {
        if (tempArray.length === 0) {
            for (const element of sortedArray) {
            if (tempArray.length > 0) {
                if (getLastValue(tempArray) > element) {
                const num = tempArray.pop();
                tempArray.push(element);
                tempArray.push(num);
                } else if (getLastValue(tempArray) < element) {
                tempArray.push(element);
                }
            } else {
                tempArray.push(element);
            }
            index += 1;
            }

            if (!isSorted(tempArray)) {
            recurse = 2;
            }
            sortedArray = tempArray;
        } else {
            tempArray.push(sortedArray[0]);
            for (const element of sortedArray) {
            if (getLastValue(tempArray) > element) {
                const num = tempArray.pop();
                tempArray.push(element);
                tempArray.push(num);
            } else if (getLastValue(tempArray) < element) {
                tempArray.push(element);
            }
            index += 1;
            }
        }
        }

        if (!isSorted(tempArray)) {
        recurse = 2;
        }
        sortedArray = tempArray;

        recurse -= 1;
    }

    const distinctArray = distinct ? [...new Set(sortedArray)] : sortedArray;
    const reverseArray = reverse ? distinctArray.reverse() : distinctArray;
    return reverseArray;
}

function getLastValue(array) {
    if (array.length > 0) {
        return array[array.length - 1];
    } else {
        return null;
    }
}

function isEven(number) {
    return number % 2 === 0;
}
  
function lookBack(array, index) {
    if (array.length > 0) {
        return array[index - 1];
    } else {
        return null;
    }
}

function lookForward(array, index) {
    if (index + 1 !== array.length) {
        return array[index + 1];
    } else {
        return null;
    }
}

function removeElement(array, index) {
    return array.filter((_, idx) => idx !== index);
}

function removeElements(array, indexes) {
    return array.filter((_, idx) => !indexes.includes(idx));
}

function execute(num_1, opcode, num_2) {
    let result = 0;

    switch (opcode) {
        case OPCODES.PWR:
        if (num_1 >= 0) {
            result = Math.pow(num_1, num_2);
        }
        break;
        case OPCODES.MUL:
        result = num_1 * num_2;
        break;
        case OPCODES.DIV:
        result = num_1 / num_2;
        break;
        case OPCODES.ADD:
        result = num_1 + num_2;
        break;
        case OPCODES.SUB:
        result = num_1 - num_2;
        break;
    }

    return result;
}

function removeSpaces(string) {
    return string.replace(/ /g, "");
}

function parser(string, evaluate = false, term = 1) {
    const formattedStr = removeSpaces(string);
    const parsedArray = [];
    let index = 0;
    let numStr = "";

    for (const token of formattedStr) {
        switch (index) {
        case 0:
            if (token === "(") {
            parsedArray.push(OPCODES.BRKOP);
            }
            if (token === "-") {
            parsedArray.push(OPCODES.SUB);
            }
            if (token === "+") {
            parsedArray.push(OPCODES.ADD);
            }
            if (token === "n") {
            if (evaluate) {
                parsedArray.push(term);
            } else {
                parsedArray.push("n");
            }
            }
            if (token !== "n" && !OPERANDS.includes(token)) {
                numStr += token;
            }
            break;

        default:
            if (OPERANDS.includes(token)) {
            if (numStr !== "") {
                if (evaluate) {
                    parsedArray.push(parseFloat(numStr));
                } else {
                    parsedArray.push(numStr);
                }
            }
            numStr = "";

            if (token === "(") {
                if (!OPERANDS.includes(formattedStr[index - 1])) {
                parsedArray.push(OPCODES.MUL);
                }
                parsedArray.push(OPCODES.BRKOP);
            }

            if (token === ")") {
                parsedArray.push(OPCODES.BRKCL);
                if (index + 1 !== formattedStr.length) {
                    if (!OPERANDS.includes(formattedStr[index + 1])) {
                        parsedArray.push(OPCODES.MUL);
                    }
                    if (formattedStr[index + 1] === "(") {
                        parsedArray.push(OPCODES.MUL);
                    }
                }
            }

            if (token === "^") {
                const lastValue = getLastValue(parsedArray);
                if (lastValue && getOpcodes().includes(lastValue)) {
                    parsedArray.pop();
                }
                parsedArray.push(OPCODES.PWR);
            }

            if (token === "/") {
                const lastValue = getLastValue(parsedArray);
                if (lastValue && getOpcodes().includes(lastValue)) {
                parsedArray.pop();
                }
                parsedArray.push(OPCODES.DIV);
            }

            if (token === "*") {
                const lastValue = getLastValue(parsedArray);
                if (lastValue && getOpcodes().includes(lastValue)) {
                parsedArray.pop();
                }
                parsedArray.push(OPCODES.MUL);
            }

            if (token === "-") {
                if (getLastValue(parsedArray) === OPCODES.SUB) {
                    parsedArray.pop();
                    const lastValue = getLastValue(parsedArray);
                    if (!lastValue || !getOpcodes().includes(lastValue)) {
                        parsedArray.push(OPCODES.ADD);
                    }
                    if (lastValue === OPCODES.BRKCL) {
                        parsedArray.push(OPCODES.ADD);
                    }
                    } else if (getLastValue(parsedArray) === OPCODES.ADD) {
                    parsedArray.pop();
                    const lastValue = getLastValue(parsedArray);
                    if (!lastValue || !getOpcodes().includes(lastValue)) {
                        parsedArray.push(OPCODES.SUB);
                    }
                    if (lastValue === OPCODES.BRKCL) {
                        parsedArray.push(OPCODES.SUB);
                    }
                } else {
                parsedArray.push(OPCODES.SUB);
                }
            }

            if (token === "+") {
                const lastValue = getLastValue(parsedArray);
                if (!lastValue || !getOpcodes().includes(lastValue)) {
                    parsedArray.push(OPCODES.ADD);
                }
                if (lastValue === OPCODES.BRKCL) {
                    parsedArray.push(OPCODES.ADD);
                }
            }
            }

            if (token !== "n" && !OPERANDS.includes(token)) {
                numStr += token;
            }

            if (token === "n") {
                if (numStr !== "") {
                    parsedArray.push(parseFloat(numStr));
                }
                numStr = "";

                if (!OPERANDS.includes(formattedStr[index - 1])) {
                    parsedArray.push(OPCODES.MUL);
                }

                if (evaluate) {
                    parsedArray.push(term);
                } else {
                    parsedArray.push("n");
                }
            }
            break;
        }

        index += 1;
    }
    if (numStr !== "") {
        if (evaluate) {
            
        parsedArray.push(parseFloat(numStr));
        } else {
        parsedArray.push(numStr);
        }
        numStr = "";
    }

    return parsedArray;
}
  
function decomposer(parsed) {
    const decomposeArray = [];
    let recurse = 1;
    let index = 0;
    let idx = 0;

    while (recurse > 0) {
        let tempArray = [];
        let tempArray1 = [];
        let tempArray2 = [];
        let brackets = 0;
      
        if (decomposeArray.length === 0) {
          for (const opcode of parsed) {
            if (brackets === 0) {
              if (tempArray.length > 0) {
                index += 1;
                recurse += 1;
                tempArray1.push(OPCODES.EVAL);
                tempArray1.push(index);
                tempArray2.push([...tempArray]);
                tempArray = [];
              }
              if (opcode !== OPCODES.BRKOP && opcode !== OPCODES.BRKCL) {
                tempArray1.push(opcode);
              }
            }
      
            if (opcode === OPCODES.BRKCL) {
              brackets -= 1;
            }
      
            if (brackets > 0) {
              tempArray.push(opcode);
            }
      
            if (opcode === OPCODES.BRKOP) {
              brackets += 1;
            }
          }
      
          if (tempArray.length > 0) {
            tempArray2.push([...tempArray]);
            tempArray = [];
            tempArray1.push(OPCODES.EVAL);
            index += 1;
            recurse += 1;
            tempArray1.push(index);
          }
      
          decomposeArray.push([...tempArray1]);
          tempArray1 = [];
      
          for (const arr of tempArray2) {
            if (arr.length > 0) {
              decomposeArray.push([...arr]);
            }
          }
        } else {
          tempArray = [];
          tempArray1 = [];
          tempArray2 = [];
          brackets = 0;
      
          for (const opcode of decomposeArray[idx]) {
            if (brackets === 0) {
              if (tempArray.length > 0) {
                index += 1;
                recurse += 1;
                tempArray1.push(OPCODES.EVAL);
                tempArray1.push(index);
                tempArray2.push([...tempArray]);
                tempArray = [];
              }
              if (opcode !== OPCODES.BRKOP && opcode !== OPCODES.BRKCL) {
                tempArray1.push(opcode);
              }
            }
      
            if (opcode === OPCODES.BRKCL) {
              brackets -= 1;
            }
      
            if (brackets > 0) {
              tempArray.push(opcode);
            }
      
            if (opcode === OPCODES.BRKOP) {
              brackets += 1;
            }
          }
      
          if (tempArray.length > 0) {
            tempArray2.push([...tempArray]);
            tempArray = [];
            tempArray1.push(OPCODES.EVAL);
            index += 1;
            recurse += 1;
            tempArray1.push(index);
          }
      
          decomposeArray[idx] = [...tempArray1];
          tempArray1 = [];
      
          for (const arr of tempArray2) {
            if (arr.length > 0) {
              decomposeArray.push([...arr]);
            }
          }
        }
      
        idx += 1;
        recurse -= 1;
      }      

    return decomposeArray;
}






export{parser,decomposer,sorter,getLastValue,getOpcodes,calcPrecidence,OPCODES,
    OPERANDS,getPrecidenceOpcode,execute,getPrecidenceIndex,lookBack,lookForward, }
    