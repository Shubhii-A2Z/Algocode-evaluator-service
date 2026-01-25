import JavaExecutor from "../containers/javaExecutor";
import PythonExecutorStrategy from "../containers/pythonExecutor";
import CodeExecutorStrategy from "../types/codeExecutorStrategy";

export default function createExecutor(codeLanguage: string): CodeExecutorStrategy | null{
    if(codeLanguage==='PYTHON'){
        return new PythonExecutorStrategy();
    }
    else if(codeLanguage==='JAVA'){
        return new JavaExecutor();
    }
    else return null;
}