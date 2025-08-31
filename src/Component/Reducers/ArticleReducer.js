import {createSlice} from "@reduxjs/toolkit"

export const OpenArticleDetail=["chalbe"];
const Article = createSlice({
    name:"Blogs",
    initialState:{value:OpenArticleDetail},
    reducers:
    {
        OpenArticle:(state,action)=>{
            state.value.push(...OpenArticleDetail,action.payload);
        }
    }
});

export const {OpenArticle}= Article.actions;
export default Article.reducer;