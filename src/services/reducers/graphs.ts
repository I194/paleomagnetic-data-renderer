import { Reducer } from "redux";

interface IGraph {
  type: 'zijd' | 'stereo' | 'mag';
  graphId: string;
  selectableNodes: Array<ChildNode>;
  selectedIndexes: Array<number>;
}

interface IGraphs {
  graphs: Array<IGraph>;
}

const initialState: IGraphs = {

  graphs: []

}

export const filesReducer: Reducer = (state = initialState, action: any) => {
  switch (action.type) {
    // case SET_INPUT_FILES: {
    //   return {
    //     ...state,
    //     inputFiles: action.files
    //   }
    // }
    default: {
      return state;
    }
  }
}