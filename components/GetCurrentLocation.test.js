const GetCurrentLocation = require("./GetCurrentLocation")
// @ponicode
describe("GetCurrentLocation.default", () => {
    test("0", () => {
        let callFunction = () => {
            GetCurrentLocation.default()
        }
    
        expect(callFunction).not.toThrow()
    })
})
