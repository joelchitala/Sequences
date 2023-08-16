import { decomposer, parser, getOpcodes, getLastValue, sorter, 
    calcPrecidence, OPCODES, getPrecidenceOpcode, getPrecidenceIndex, lookForward, execute } from "./utils.js";

class SequenceCompiler {
    constructor() {
      this.data = {
        stack: [],
      };
    }
  
    compiler(values, recurse = false) {
      let result = 0;
      const stack = this.data.stack;
  
      let groups;
      let res;
  
      if (recurse) {
        groups = sorter(
            calcPrecidence(values).map(x => x.group),
          true,
          true
        );
        res = values;
      } else {
        groups = sorter(
          calcPrecidence(values[0]).map(x => x.group),
          true,
          true
        );
        res = values[0];
      }


  
      if (groups.length === 0 && values.length > 0) {
        if (Array.isArray(values[0]) && values[0].length > 0) {
          result = values[0][0];
        } else {
          result = values[0];
        }
      }

  
      while (groups.length > 0) {
        const precidences = calcPrecidence(res);
        let index = 0;
        const tempArray = [];
        let skip = 0;
        let opcodeSkip = 0;
  
        for (const opcode of res) {
          if (getOpcodes().includes(opcode)) {
            if (
              getPrecidenceOpcode(opcode).group ===
              getLastValue(groups)
            ) {
              const pr = getPrecidenceIndex(precidences, index);
  
              switch (opcode) {
                case OPCODES.EVAL:
                  const exec = this.compiler(
                    stack[lookForward(res, pr.index)],
                    true
                  );
                  tempArray.push(exec);
                  skip += 1;
                  break;
                default:
                  if (tempArray.length > 0) {
                    const num1 = getLastValue(tempArray);
                    const num2 = lookForward(res, pr.index);
                    if (num2 === OPCODES.SUB) {
                      opcodeSkip += 1;
                    }
                    tempArray.pop();
                    tempArray.push(execute(num1, opcode, num2));
                    skip += 1;
                  } else {
                    tempArray.push(
                      execute(
                        0,
                        opcode,
                        lookForward(res, pr.index)
                      )
                    );
                    skip += 1;
                  }
                  break;
              }
            } else {
              if (opcodeSkip === 0) {
                tempArray.push(opcode);
              } else if (opcodeSkip > 0) {
                opcodeSkip -= 1;
              }
            }
          } else {
            if (skip === 0) {
              tempArray.push(opcode);
            } else if (skip > 0) {
              skip -= 1;
            }
          }
  
          index += 1;
        }
  
        res = tempArray;
        result = res[0];
        groups.pop();
      }
  
      return result;
    }
  
    main(equation, terms = 1, step = 1) {
        const results = [];
        let i = 1;

        while (i <= terms) {
            const parse = parser(equation, true, i);
            const values = decomposer(parse);
            this.data.stack = values;
            results.push(this.compiler(values));
            i += step;
        }

        return results;
    }
}

export{SequenceCompiler}
  