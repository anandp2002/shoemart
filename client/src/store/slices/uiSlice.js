import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        sidebarOpen: false,
        mobileMenuOpen: false,
        searchOpen: false,
    },
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        closeSidebar: (state) => {
            state.sidebarOpen = false;
        },
        toggleMobileMenu: (state) => {
            state.mobileMenuOpen = !state.mobileMenuOpen;
        },
        closeMobileMenu: (state) => {
            state.mobileMenuOpen = false;
        },
        toggleSearch: (state) => {
            state.searchOpen = !state.searchOpen;
        },
        closeSearch: (state) => {
            state.searchOpen = false;
        },
    },
});

export const {
    toggleSidebar,
    closeSidebar,
    toggleMobileMenu,
    closeMobileMenu,
    toggleSearch,
    closeSearch,
} = uiSlice.actions;
export default uiSlice.reducer;
