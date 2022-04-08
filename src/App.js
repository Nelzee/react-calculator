import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './styles.css';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}) {
  switch(type) {
    case ACTIONS.ADD_DIGIT: 
      if (state.overwrite) {return {...state, currentOperand:payload.digit,overwrite:false}}
      if (payload.digit === "0" && state.currentOperand === "0"){return state}
      if (payload.digit === "." && state.currentOperand.includes(".")){return state}
      return {
      ...state,
      currentOperand:`${state.currentOperand||""}${payload.digit}`
    }
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand ==null && state.previousOperand == null){
        return state
      }
      if (state.currentOperand == null) {
        return {...state, operation:payload.operation}
      }
      if (state.previousOperand == null) {
        return {
        ...state,
        operation: payload.operation,
        previousOperand: state.currentOperand,
        currentOperand: null
      }
    }
    return {
      state,
      previousOperand: evaluate(state),
      operation: payload.operation,
      currentOperand: null
    }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite) {
        return{
          ...state,overwrite:false,currentOperand:null
        }
      }
      if (state.currentOperand == null) {return state}
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null}
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    case ACTIONS.EVALUATE:
      if(state.operation != null || state.currentOperand != null || state.previousOperand != null) {
        return {
          overwrite:true,
          state, previousOperand: null,
          operation: null,
          currentOperand: evaluate(state),
        }
      }
  }
}

function evaluate({currentOperand, previousOperand, operation}){
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)){return ""}
  let computation = "";
  switch(operation){
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if(operand == null) return
  const [integer, decimal] = operand.split(".")
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{currentOperand, previousOperand, operation}, dispach] = useReducer(reducer, {})
  return (
    <div className="calculator-grid">
      <div className='output'>
        <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
        <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>
      <button className='span-two' onClick={() => dispach({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispach({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="÷" dispach={dispach}/>
      <DigitButton digit="1" dispach={dispach}/>
      <DigitButton digit="2" dispach={dispach}/>
      <DigitButton digit="3" dispach={dispach}/>
      <OperationButton operation="*" dispach={dispach}/>
      <DigitButton digit="4" dispach={dispach}/>
      <DigitButton digit="5" dispach={dispach}/>
      <DigitButton digit="6" dispach={dispach}/>
      <OperationButton operation="+" dispach={dispach}/>
      <DigitButton digit="7" dispach={dispach}/>
      <DigitButton digit="8" dispach={dispach}/>
      <DigitButton digit="9" dispach={dispach}/>
      <OperationButton operation="-" dispach={dispach}/>
      <DigitButton digit="." dispach={dispach}/>
      <DigitButton digit="0" dispach={dispach}/>
      <button className='span-two' onClick={() => dispach({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
