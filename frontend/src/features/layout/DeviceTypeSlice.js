import { createSlice } from '@reduxjs/toolkit';

const DeviceTypeSlice = createSlice({
    name: 'deviceType',
    initialState: {
        deviceType: 
            window.innerWidth > 1200 ? 'desktop' : 
            window.innerWidth > 900 ? 'small-desktop' :
            window.innerWidth > 600 ? 'tablet' : 
            'mobile',
    },
    reducers: {
        setDeviceType(state, action) {
            if (action.payload >= 1200) state.deviceType = 'desktop';
            if (action.payload < 1200 && action.payload > 900) state.deviceType = 'small-desktop';
            if (action.payload < 900 && action.payload > 600) state.deviceType = 'tablet';
            if (action.payload < 600) state.deviceType = 'mobile';
        },
    },
});

export const { setDeviceType } = DeviceTypeSlice.actions;
export default DeviceTypeSlice.reducer;