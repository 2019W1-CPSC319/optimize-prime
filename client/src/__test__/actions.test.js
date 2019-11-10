import {
    ADD_ROOM_SUCCESS,
    ADD_ROOM_FAILURE,
    DELETE_ROOM_SUCCESS,
    DELETE_ROOM_FAILURE,
    GET_ROOMS_SUCCESS,
    GET_ROOMS_FAILURE,
    getRooms,
    addRoom,
    deleteRoom,
} from '../actions';

describe('redux actions', () => {
    describe('rooms actions', () => {
        describe('getRooms', () => {
            it('uses the GET_ROOMS_SUCCESS type', () => {
                const action = getRooms();

                expect(action.type).toBe(GET_ROOMS_SUCCESS);
            });
        });
    });
});
