import { Tester } from "./index"

test('generation', ()=>{
    expect(new Tester().test()).toBe("working")
})