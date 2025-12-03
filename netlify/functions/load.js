exports.handler = async function(event, context) {
    // Check User-Agent
    const userAgent = event.headers['user-agent'] || '';
    
    // If browser, show 404
    if (userAgent.includes('Mozilla') && !userAgent.includes('Roblox')) {
        return {
            statusCode: 404,
            headers: {'Content-Type': 'text/html'},
            body: '<!DOCTYPE html><html><head><style>body{background:#000;color:#666;text-align:center;padding:50px;}</style></head><body><h1>404</h1><p>Page not found</p></body></html>'
        };
    }
    
    // Serve script to Roblox
    const luaScript = `-- DASH & GODMODE SCRIPT v1.0
-- Client-side only - Execute in LocalScript

if not game:IsLoaded() then
    game.Loaded:Wait()
end

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local Workspace = game:GetService("Workspace")

local LocalPlayer = Players.LocalPlayer
local PlayerGui = LocalPlayer:WaitForChild("PlayerGui")

-- Variables
local DashHotkey = "E"
local IsGodmode = false
local IsSelectingKey = false
local IsMobileDashActive = false
local DashCooldown = false
local OriginalMaxHealth = 100
local GodmodeHealth = 9999999
local DashDistance = 30
local DashDuration = 0.15
local CooldownTime = 2
local DashSpeed = 100
local LoadSoundId = 102483636290461
local DashConnection = nil
local MobileDashGui = nil
local GodmodeGui = nil

-- Play load sound
spawn(function()
    wait(0.1)
    local loadSound = Instance.new("Sound")
    loadSound.SoundId = "rbxassetid://" .. tostring(LoadSoundId)
    loadSound.Volume = 1
    loadSound.Parent = Workspace
    loadSound:Play()
    game:GetService("Debris"):AddItem(loadSound, 3)
end)

-- Cleanup function
function CleanupScript()
    if DashConnection then
        DashConnection:Disconnect()
        DashConnection = nil
    end
    
    if MobileDashGui then
        MobileDashGui:Destroy()
        MobileDashGui = nil
    end
    
    if GodmodeGui then
        GodmodeGui:Destroy()
        GodmodeGui = nil
    end
    
    IsMobileDashActive = false
    DashCooldown = false
end

-- UI Creation Functions
function CreatePopup(text, duration)
    local screenGui = Instance.new("ScreenGui")
    screenGui.Name = "IntroPopup"
    screenGui.ResetOnSpawn = false
    screenGui.IgnoreGuiInset = true
    screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Global
    screenGui.Parent = PlayerGui

    local frame = Instance.new("Frame")
    frame.Size = UDim2.new(1, 0, 1, 0)
    frame.BackgroundColor3 = Color3.fromRGB(0, 0, 0)
    frame.BackgroundTransparency = 1
    frame.Parent = screenGui

    local textLabel = Instance.new("TextLabel")
    textLabel.Size = UDim2.new(0, 400, 0, 80)
    textLabel.Position = UDim2.new(0.5, -200, 0.5, -40)
    textLabel.BackgroundColor3 = Color3.fromRGB(25, 25, 35)
    textLabel.BackgroundTransparency = 0.8
    textLabel.Text = text
    textLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
    textLabel.TextScaled = true
    textLabel.Font = Enum.Font.GothamBold
    textLabel.TextStrokeTransparency = 0.5
    textLabel.TextStrokeColor3 = Color3.fromRGB(150, 0, 255)
    textLabel.Visible = false
    textLabel.Parent = frame

    local uiCorner = Instance.new("UICorner")
    uiCorner.CornerRadius = UDim.new(0, 12)
    uiCorner.Parent = textLabel

    local uiStroke = Instance.new("UIStroke")
    uiStroke.Color = Color3.fromRGB(150, 0, 255)
    uiStroke.Thickness = 3
    uiStroke.Parent = textLabel

    -- Animate in
    textLabel.Visible = true
    textLabel.BackgroundTransparency = 1
    textLabel.TextTransparency = 1
    uiStroke.Transparency = 1

    local tweenIn = TweenService:Create(textLabel, TweenInfo.new(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), {
        BackgroundTransparency = 0.8,
        TextTransparency = 0
    })
    
    local tweenStroke = TweenService:Create(uiStroke, TweenInfo.new(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), {
        Transparency = 0
    })

    tweenIn:Play()
    tweenStroke:Play()
    tweenIn.Completed:Wait()

    -- Wait duration
    wait(duration)

    -- Animate out
    local tweenOut = TweenService:Create(textLabel, TweenInfo.new(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.In), {
        BackgroundTransparency = 1,
        TextTransparency = 1
    })
    
    local tweenStrokeOut = TweenService:Create(uiStroke, TweenInfo.new(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.In), {
        Transparency = 1
    })

    tweenOut:Play()
    tweenStrokeOut:Play()
    tweenOut.Completed:Wait()

    screenGui:Destroy()
end

function CreateSelectorUI()
    local screenGui = Instance.new("ScreenGui")
    screenGui.Name = "DashSelector"
    screenGui.ResetOnSpawn = false
    screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Global
    screenGui.Parent = PlayerGui

    local mainFrame = Instance.new("Frame")
    mainFrame.Size = UDim2.new(0, 300, 0, 200)
    mainFrame.Position = UDim2.new(0.5, -150, 0.5, -100)
    mainFrame.BackgroundColor3 = Color3.fromRGB(30, 20, 40)
    mainFrame.BackgroundTransparency = 0.1
    mainFrame.Parent = screenGui

    local uiCorner = Instance.new("UICorner")
    uiCorner.CornerRadius = UDim.new(0, 12)
    uiCorner.Parent = mainFrame

    local uiStroke = Instance.new("UIStroke")
    uiStroke.Color = Color3.fromRGB(100, 0, 200)
    uiStroke.Thickness = 2
    uiStroke.Parent = mainFrame

    local titleLabel = Instance.new("TextLabel")
    titleLabel.Size = UDim2.new(1, 0, 0, 40)
    titleLabel.Position = UDim2.new(0, 0, 0, 10)
    titleLabel.BackgroundTransparency = 1
    titleLabel.Text = "DASH SCRIPT"
    titleLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
    titleLabel.TextScaled = true
    titleLabel.Font = Enum.Font.GothamBold
    titleLabel.Parent = mainFrame

    -- PC Button
    local pcButton = Instance.new("TextButton")
    pcButton.Size = UDim2.new(0.8, 0, 0, 40)
    pcButton.Position = UDim2.new(0.1, 0, 0.4, 0)
    pcButton.BackgroundColor3 = Color3.fromRGB(100, 0, 200)
    pcButton.Text = "PC"
    pcButton.TextColor3 = Color3.fromRGB(255, 255, 255)
    pcButton.Font = Enum.Font.GothamSemibold
    pcButton.TextSize = 18
    pcButton.Parent = mainFrame

    local pcCorner = Instance.new("UICorner")
    pcCorner.CornerRadius = UDim.new(0, 8)
    pcCorner.Parent = pcButton

    local pcStroke = Instance.new("UIStroke")
    pcStroke.Color = Color3.fromRGB(150, 50, 255)
    pcStroke.Thickness = 2
    pcStroke.Parent = pcButton

    -- Mobile Button
    local mobileButton = Instance.new("TextButton")
    mobileButton.Size = UDim2.new(0.8, 0, 0, 40)
    mobileButton.Position = UDim2.new(0.1, 0, 0.65, 0)
    mobileButton.BackgroundColor3 = Color3.fromRGB(100, 0, 200)
    mobileButton.Text = "MOBILE"
    mobileButton.TextColor3 = Color3.fromRGB(255, 255, 255)
    mobileButton.Font = Enum.Font.GothamSemibold
    mobileButton.TextSize = 18
    mobileButton.Parent = mainFrame

    local mobileCorner = Instance.new("UICorner")
    mobileCorner.CornerRadius = UDim.new(0, 8)
    mobileCorner.Parent = mobileButton

    local mobileStroke = Instance.new("UIStroke")
    mobileStroke.Color = Color3.fromRGB(150, 50, 255)
    mobileStroke.Thickness = 2
    mobileStroke.Parent = mobileButton

    -- Button animations
    local function setupButtonHover(button)
        local originalSize = button.Size
        local originalColor = button.BackgroundColor3
        
        button.MouseEnter:Connect(function()
            TweenService:Create(button, TweenInfo.new(0.2), {
                BackgroundColor3 = Color3.fromRGB(130, 30, 230)
            }):Play()
        end)
        
        button.MouseLeave:Connect(function()
            TweenService:Create(button, TweenInfo.new(0.2), {
                BackgroundColor3 = originalColor
            }):Play()
        end)
        
        button.MouseButton1Down:Connect(function()
            TweenService:Create(button, TweenInfo.new(0.1), {
                Size = originalSize - UDim2.new(0, 5, 0, 5)
            }):Play()
        end)
        
        button.MouseButton1Up:Connect(function()
            TweenService:Create(button, TweenInfo.new(0.1), {
                Size = originalSize
            }):Play()
        end)
    end

    setupButtonHover(pcButton)
    setupButtonHover(mobileButton)

    -- Button functions
    pcButton.MouseButton1Click:Connect(function()
        screenGui:Destroy()
        CreateKeySelector()
    end)

    mobileButton.MouseButton1Click:Connect(function()
        screenGui:Destroy()
        CreateMobileDashButton()
    end)

    return screenGui
end

function CreateKeySelector()
    local screenGui = Instance.new("ScreenGui")
    screenGui.Name = "KeySelector"
    screenGui.ResetOnSpawn = false
    screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Global
    screenGui.Parent = PlayerGui

    local mainFrame = Instance.new("Frame")
    mainFrame.Size = UDim2.new(0, 250, 0, 150)
    mainFrame.Position = UDim2.new(0.5, -125, 0.5, -75)
    mainFrame.BackgroundColor3 = Color3.fromRGB(30, 20, 40)
    mainFrame.BackgroundTransparency = 0.1
    mainFrame.Parent = screenGui

    local uiCorner = Instance.new("UICorner")
    uiCorner.CornerRadius = UDim.new(0, 12)
    uiCorner.Parent = mainFrame

    local uiStroke = Instance.new("UIStroke")
    uiStroke.Color = Color3.fromRGB(100, 0, 200)
    uiStroke.Thickness = 2
    uiStroke.Parent = mainFrame

    local titleLabel = Instance.new("TextLabel")
    titleLabel.Size = UDim2.new(1, 0, 0, 30)
    titleLabel.Position = UDim2.new(0, 0, 0, 10)
    titleLabel.BackgroundTransparency = 1
    titleLabel.Text = "PRESS ANY KEY"
    titleLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
    titleLabel.TextScaled = true
    titleLabel.Font = Enum.Font.GothamBold
    titleLabel.Parent = mainFrame

    local keyLabel = Instance.new("TextLabel")
    keyLabel.Size = UDim2.new(1, 0, 0, 40)
    keyLabel.Position = UDim2.new(0, 0, 0.3, 0)
    keyLabel.BackgroundTransparency = 1
    keyLabel.Text = "Current: " .. DashHotkey
    keyLabel.TextColor3 = Color3.fromRGB(200, 100, 255)
    keyLabel.TextScaled = true
    keyLabel.Font = Enum.Font.GothamSemibold
    keyLabel.Parent = mainFrame

    local doneButton = Instance.new("TextButton")
    doneButton.Size = UDim2.new(0.6, 0, 0, 35)
    doneButton.Position = UDim2.new(0.2, 0, 0.7, 0)
    doneButton.BackgroundColor3 = Color3.fromRGB(100, 0, 200)
    doneButton.Text = "DONE"
    doneButton.TextColor3 = Color3.fromRGB(255, 255, 255)
    doneButton.Font = Enum.Font.GothamSemibold
    doneButton.TextSize = 16
    doneButton.Parent = mainFrame

    local doneCorner = Instance.new("UICorner")
    doneCorner.CornerRadius = UDim.new(0, 8)
    doneCorner.Parent = doneButton

    doneButton.MouseButton1Click:Connect(function()
        screenGui:Destroy()
        SetupDashListener()
    end)

    IsSelectingKey = true
    
    local keyConnection
    keyConnection = UserInputService.InputBegan:Connect(function(input, gameProcessed)
        if gameProcessed or not IsSelectingKey then return end
        
        if input.UserInputType == Enum.UserInputType.Keyboard then
            DashHotkey = input.KeyCode.Name
            keyLabel.Text = "Current: " .. DashHotkey
            
            -- Animate key change
            TweenService:Create(keyLabel, TweenInfo.new(0.2), {
                TextColor3 = Color3.fromRGB(255, 255, 255)
            }):Play()
            
            wait(0.2)
            
            TweenService:Create(keyLabel, TweenInfo.new(0.2), {
                TextColor3 = Color3.fromRGB(200, 100, 255)
            }):Play()
        end
    end)
    
    -- Cleanup when GUI is destroyed
    screenGui.Destroying:Connect(function()
        IsSelectingKey = false
        if keyConnection then
            keyConnection:Disconnect()
        end
    end)
end

-- FIXED MOBILE DASH BUTTON
function CreateMobileDashButton()
    IsMobileDashActive = true
    
    -- Clean up old mobile dash GUI if exists
    if MobileDashGui then
        MobileDashGui:Destroy()
    end
    
    MobileDashGui = Instance.new("ScreenGui")
    MobileDashGui.Name = "MobileDash"
    MobileDashGui.ResetOnSpawn = false
    MobileDashGui.ZIndexBehavior = Enum.ZIndexBehavior.Global
    MobileDashGui.Parent = PlayerGui

    local dashButton = Instance.new("TextButton")
    dashButton.Size = UDim2.new(0, 100, 0, 100)
    dashButton.Position = UDim2.new(0.8, -50, 0.7, -50)
    dashButton.BackgroundColor3 = Color3.fromRGB(100, 0, 200)
    dashButton.BackgroundTransparency = 0.2
    dashButton.Text = "DASH"
    dashButton.TextColor3 = Color3.fromRGB(255, 255, 255)
    dashButton.Font = Enum.Font.GothamBold
    dashButton.TextSize = 20
    dashButton.TextScaled = true
    dashButton.Parent = MobileDashGui

    local uiCorner = Instance.new("UICorner")
    uiCorner.CornerRadius = UDim.new(1, 0)
    uiCorner.Parent = dashButton

    local uiStroke = Instance.new("UIStroke")
    uiStroke.Color = Color3.fromRGB(150, 50, 255)
    uiStroke.Thickness = 3
    uiStroke.Parent = dashButton

    -- FIXED: Button activation
    local function onDashButtonClicked()
        if not DashCooldown then
            PerformDash()
        end
    end

    -- Mobile touch input
    dashButton.MouseButton1Down:Connect(function()
        -- Button press animation
        TweenService:Create(dashButton, TweenInfo.new(0.1), {
            Size = UDim2.new(0, 90, 0, 90),
            BackgroundTransparency = 0.1
        }):Play()
    end)
    
    dashButton.MouseButton1Up:Connect(function()
        -- Button release animation
        TweenService:Create(dashButton, TweenInfo.new(0.1), {
            Size = UDim2.new(0, 100, 0, 100),
            BackgroundTransparency = 0.2
        }):Play()
        
        onDashButtonClicked()
    end)
    
    dashButton.MouseButton1Click:Connect(onDashButtonClicked)
    
    -- Draggable functionality
    local dragging = false
    local dragStart = nil
    local startPos = nil

    dashButton.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.Touch then
            dragging = true
            dragStart = input.Position
            startPos = dashButton.Position
            
            TweenService:Create(dashButton, TweenInfo.new(0.1), {
                Size = UDim2.new(0, 90, 0, 90),
                BackgroundTransparency = 0.1
            }):Play()
        end
    end)

    dashButton.InputEnded:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.Touch then
            dragging = false
            
            TweenService:Create(dashButton, TweenInfo.new(0.1), {
                Size = UDim2.new(0, 100, 0, 100),
                BackgroundTransparency = 0.2
            }):Play()
            
            -- Only trigger dash if it was a tap (minimal movement)
            if dragStart and (input.Position - dragStart).Magnitude < 20 then
                onDashButtonClicked()
            end
        end
    end)

    local dragConnection
    dragConnection = UserInputService.InputChanged:Connect(function(input)
        if dragging and input.UserInputType == Enum.UserInputType.Touch then
            local delta = input.Position - dragStart
            dashButton.Position = startPos + UDim2.new(0, delta.X, 0, delta.Y)
        end
    end)
    
    -- Cleanup
    MobileDashGui.Destroying:Connect(function()
        IsMobileDashActive = false
        if dragConnection then
            dragConnection:Disconnect()
        end
    end)
    
    return MobileDashGui
end

function CreateGodmodeButton()
    -- Clean up old godmode GUI if exists
    if GodmodeGui then
        GodmodeGui:Destroy()
    end
    
    GodmodeGui = Instance.new("ScreenGui")
    GodmodeGui.Name = "GodmodeUI"
    GodmodeGui.ResetOnSpawn = false
    GodmodeGui.ZIndexBehavior = Enum.ZIndexBehavior.Global
    GodmodeGui.Parent = PlayerGui

    local godButton = Instance.new("TextButton")
    godButton.Size = UDim2.new(0, 160, 0, 45)
    godButton.Position = UDim2.new(0.5, -80, 0.05, 0)
    godButton.BackgroundColor3 = Color3.fromRGB(100, 0, 200)
    godButton.Text = "GODMODE: OFF"
    godButton.TextColor3 = Color3.fromRGB(255, 255, 255)
    godButton.Font = Enum.Font.GothamBold
    godButton.TextSize = 16
    godButton.Parent = GodmodeGui

    local uiCorner = Instance.new("UICorner")
    uiCorner.CornerRadius = UDim.new(0, 8)
    uiCorner.Parent = godButton

    local uiStroke = Instance.new("UIStroke")
    uiStroke.Color = Color3.fromRGB(255, 255, 255)
    uiStroke.Thickness = 2
    uiStroke.Parent = godButton

    -- Rainbow gradient for stroke
    local gradient = Instance.new("UIGradient")
    gradient.Color = ColorSequence.new({
        ColorSequenceKeypoint.new(0, Color3.fromRGB(255, 0, 0)),
        ColorSequenceKeypoint.new(0.17, Color3.fromRGB(255, 165, 0)),
        ColorSequenceKeypoint.new(0.33, Color3.fromRGB(255, 255, 0)),
        ColorSequenceKeypoint.new(0.5, Color3.fromRGB(0, 255, 0)),
        ColorSequenceKeypoint.new(0.67, Color3.fromRGB(0, 0, 255)),
        ColorSequenceKeypoint.new(0.83, Color3.fromRGB(75, 0, 130)),
        ColorSequenceKeypoint.new(1, Color3.fromRGB(238, 130, 238))
    })
    gradient.Rotation = 45
    gradient.Parent = uiStroke

    -- Animate gradient
    local gradientAnimation
    gradientAnimation = RunService.RenderStepped:Connect(function(delta)
        gradient.Offset = Vector2.new(math.cos(tick() * 2) * 0.5, math.sin(tick() * 2) * 0.5)
    end)

    -- Hover animations
    godButton.MouseEnter:Connect(function()
        TweenService:Create(godButton, TweenInfo.new(0.2), {
            BackgroundColor3 = Color3.fromRGB(130, 30, 230)
        }):Play()
    end)
    
    godButton.MouseLeave:Connect(function()
        TweenService:Create(godButton, TweenInfo.new(0.2), {
            BackgroundColor3 = Color3.fromRGB(100, 0, 200)
        }):Play()
    end)

    godButton.MouseButton1Click:Connect(function()
        IsGodmode = not IsGodmode
        
        if IsGodmode then
            godButton.Text = "GODMODE: ON"
            TweenService:Create(godButton, TweenInfo.new(0.2), {
                BackgroundColor3 = Color3.fromRGB(0, 200, 0)
            }):Play()
            ActivateGodmode()
        else
            godButton.Text = "GODMODE: OFF"
            TweenService:Create(godButton, TweenInfo.new(0.2), {
                BackgroundColor3 = Color3.fromRGB(100, 0, 200)
            }):Play()
            DeactivateGodmode()
        end
    end)
    
    -- Cleanup
    GodmodeGui.Destroying:Connect(function()
        if gradientAnimation then
            gradientAnimation:Disconnect()
        end
    end)
    
    return GodmodeGui
end

-- WALL-PHASING DASH FUNCTIONALITY
function PerformDash()
    if DashCooldown then return end
    
    local character = LocalPlayer.Character
    if not character then return end
    
    local humanoid = character:FindFirstChild("Humanoid")
    local humanoidRootPart = character:FindFirstChild("HumanoidRootPart")
    
    if not humanoid or not humanoidRootPart then return end
    
    if humanoid.Health <= 0 or humanoid:GetState() == Enum.HumanoidStateType.Dead then
        return
    end
    
    DashCooldown = true
    
    -- Store original properties for wall phasing
    local originalCanCollide = {}
    local originalTransparency = {}
    
    -- Make character parts non-collidable and transparent temporarily
    for _, part in pairs(character:GetDescendants()) do
        if part:IsA("BasePart") then
            originalCanCollide[part] = part.CanCollide
            originalTransparency[part] = part.Transparency
            part.CanCollide = false
            part.Transparency = 0.7
        end
    end
    
    -- Get dash direction
    local dashDirection = humanoidRootPart.CFrame.LookVector
    local startPosition = humanoidRootPart.Position
    local targetPosition = startPosition + (dashDirection * DashDistance)
    
    -- Use BodyVelocity for visible movement
    local bodyVelocity = Instance.new("BodyVelocity")
    bodyVelocity.Velocity = dashDirection * DashSpeed
    bodyVelocity.MaxForce = Vector3.new(10000, 10000, 10000)
    bodyVelocity.P = 10000
    bodyVelocity.Parent = humanoidRootPart
    
    -- Cooldown indicator for mobile button
    if IsMobileDashActive and MobileDashGui then
        local dashButton = MobileDashGui:FindFirstChild("TextButton")
        if dashButton then
            TweenService:Create(dashButton, TweenInfo.new(0.2), {
                BackgroundColor3 = Color3.fromRGB(50, 0, 100)
            }):Play()
        end
    end
    
    -- Create a simple purple flash effect
    spawn(function()
        for _, part in pairs(character:GetDescendants()) do
            if part:IsA("BasePart") then
                local originalColor = part.Color
                part.Color = Color3.fromRGB(150, 50, 255)
                
                spawn(function()
                    wait(0.1)
                    part.Color = originalColor
                end)
            end
        end
    end)
    
    -- Wait for dash duration
    wait(DashDuration)
    
    -- Remove velocity
    if bodyVelocity and bodyVelocity.Parent then
        bodyVelocity:Destroy()
    end
    
    -- Restore original properties
    for part, canCollide in pairs(originalCanCollide) do
        if part and part.Parent then
            part.CanCollide = canCollide
        end
    end
    
    for part, transparency in pairs(originalTransparency) do
        if part and part.Parent then
            part.Transparency = transparency
        end
    end
    
    -- Reset cooldown
    spawn(function()
        wait(CooldownTime - DashDuration)
        DashCooldown = false
        
        -- Reset button color for mobile
        if IsMobileDashActive and MobileDashGui then
            local dashButton = MobileDashGui:FindFirstChild("TextButton")
            if dashButton then
                TweenService:Create(dashButton, TweenInfo.new(0.2), {
                    BackgroundColor3 = Color3.fromRGB(100, 0, 200)
                }):Play()
            end
        end
    end)
end

-- FIXED: Dash listener that reconnects on respawn
function SetupDashListener()
    -- Disconnect old listener if exists
    if DashConnection then
        DashConnection:Disconnect()
    end
    
    -- Create new listener
    DashConnection = UserInputService.InputBegan:Connect(function(input, gameProcessed)
        if gameProcessed or IsSelectingKey then return end
        
        if input.UserInputType == Enum.UserInputType.Keyboard and input.KeyCode.Name == DashHotkey then
            PerformDash()
        end
    end)
end

-- Godmode functionality
local GodmodeConnection = nil
local OriginalHealth = 100

function ActivateGodmode()
    local character = LocalPlayer.Character
    if not character then return end
    
    local humanoid = character:WaitForChild("Humanoid", 5)
    if not humanoid then return end
    
    -- Save original health
    OriginalHealth = humanoid.Health
    OriginalMaxHealth = humanoid.MaxHealth
    
    -- Set godmode health
    humanoid.MaxHealth = GodmodeHealth
    humanoid.Health = GodmodeHealth
    
    -- Force alive state
    if humanoid:GetState() == Enum.HumanoidStateType.Dead then
        humanoid:ChangeState(Enum.HumanoidStateType.Running)
    end
    
    -- Continuous health correction
    if GodmodeConnection then
        GodmodeConnection:Disconnect()
    end
    
    GodmodeConnection = RunService.Heartbeat:Connect(function()
        if not IsGodmode then
            GodmodeConnection:Disconnect()
            return
        end
        
        local currentChar = LocalPlayer.Character
        if not currentChar then return end
        
        local currentHum = currentChar:FindFirstChild("Humanoid")
        if not currentHum then return end
        
        -- Force health to max
        currentHum.MaxHealth = GodmodeHealth
        currentHum.Health = GodmodeHealth
        
        -- Prevent death state
        if currentHum:GetState() == Enum.HumanoidStateType.Dead then
            currentHum:ChangeState(Enum.HumanoidStateType.Running)
        end
        
        -- Remove any negative health effects
        for _, v in pairs(currentChar:GetChildren()) do
            if v:IsA("ForceField") then
                v:Destroy()
            end
        end
    end)
end

function DeactivateGodmode()
    IsGodmode = false
    
    if GodmodeConnection then
        GodmodeConnection:Disconnect()
        GodmodeConnection = nil
    end
    
    local character = LocalPlayer.Character
    if not character then return end
    
    local humanoid = character:FindFirstChild("Humanoid")
    if not humanoid then return end
    
    -- Restore original health
    humanoid.MaxHealth = OriginalMaxHealth
    humanoid.Health = math.min(OriginalHealth, OriginalMaxHealth)
end

-- Initialize everything
function InitializeScript()
    -- Play intro popup
    CreatePopup("LOADED 0x0x0 DASH SCRIPT", 2)
    
    wait(0.5)
    
    -- Create UI elements
    CreateSelectorUI()
    CreateGodmodeButton()
    
    -- Setup dash listener for PC
    if not IsMobileDashActive then
        SetupDashListener()
    end
    
    print("Dash & Godmode Script Loaded Successfully!")
    print("Dash Key: " .. DashHotkey)
    print("Cooldown: " .. CooldownTime .. " seconds")
    print("Wall Phasing: ENABLED")
    print("Respawn Support: ENABLED")
end

-- Handle respawning
LocalPlayer.CharacterAdded:Connect(function(character)
    wait(1) -- Wait for character to fully load
    
    print("Character respawned - reinitializing dash system...")
    
    -- Reset dash cooldown
    DashCooldown = false
    
    -- Reapply godmode if it was active
    if IsGodmode then
        wait(0.5)
        local humanoid = character:WaitForChild("Humanoid", 5)
        if humanoid then
            humanoid.MaxHealth = GodmodeHealth
            humanoid.Health = GodmodeHealth
            
            -- Reactivate godmode system
            ActivateGodmode()
        end
    end
    
    -- Re-setup dash listener for PC
    if not IsMobileDashActive then
        SetupDashListener()
    end
    
    -- Reset mobile button color if active
    if IsMobileDashActive and MobileDashGui then
        local dashButton = MobileDashGui:FindFirstChild("TextButton")
        if dashButton then
            TweenService:Create(dashButton, TweenInfo.new(0.2), {
                BackgroundColor3 = Color3.fromRGB(100, 0, 200)
            }):Play()
        end
    end
end)

-- Cleanup on character removal
LocalPlayer.CharacterRemoving:Connect(function()
    DashCooldown = false
    print("Character removed - resetting dash cooldown...")
end)

-- Cleanup on player leaving
LocalPlayer.PlayerGui.ChildRemoved:Connect(function(child)
    if child.Name == "MobileDash" or child.Name == "GodmodeUI" then
        CleanupScript()
    end
end)

-- Start the script
InitializeScript()`;
    
    return {
        statusCode: 200,
        headers: {'Content-Type': 'text/plain'},
        body: luaScript
    };
};
