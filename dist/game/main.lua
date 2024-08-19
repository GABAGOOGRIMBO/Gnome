require "./test"

local game = {}

game.init = function()
    print("init")
end

game.update = function()
    print("update")
end

game.draw = function()
    print("draw")
end

return game