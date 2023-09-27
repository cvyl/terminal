$(document).ready(function() {
// Define commands
const commands = {
    "help": {
      description: "Shows available commands",
      syntax: "help [command]",
      action: function(args) {
        if (args.length > 0) {
          let command = commands[args[0]];
          if (command) {
            $(".prompt").before("<div class='output'>" + command.description + "<br>Usage: " + command.syntax + "</div>");
          } else {
            $(".prompt").before("<div class='output'>Command not found.</div>");
          }
        } else {
          let output = "<div class='output'>Available commands: <br>";
          for (const command in commands) {
            output += " - " + command + ": " + commands[command].description + "<br>";
          }
          output += "</div>";
          $(".prompt").before(output);
        }
      }
    },
    "clear": {
      description: "Clears the console",
      syntax: "clear",
      action: function() {
        $(".input").remove();
        $(".output").remove();
      }
    },
    "dir": {
      description: "Shows available files in the directory",
      syntax: "dir",
      action: function() {
        for (let i = 0; i < files.length; i++) {
          $(".prompt").before("<div class='output'>" + files[i].name + "</div>");
        }
      }
    },
    "location": {
      description: "Geolocates the user",
      syntax: "location",
      action: function() {
        navigator.geolocation.getCurrentPosition(function(position) {
          $(".prompt").before("<div class='output'>Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude + "</div>");
        });
      }
    },
    "load": {
      description: "Loads a webpage",
      syntax: "load [filename]",
      action: function(args) {
        let filename = args[0];
        let file = files.find(file => file.name === filename);
        if (file) {
          if (file.target === "url") {
            window.location.href = file.path;
          } else if (file.target === "file") {
            $(".terminal").load(file.path);
          } else if (file.target === "command") {
            file.action();
          }
        } else {
          $(".prompt").before("<div class='output'>File not found.</div>");
        }
      },
      requiresArgs: true
    },
    "cat": {
      description: "Displays the contents of a file",
      syntax: "cat [filename]",
      action: function(args) {
        let filename = args[0];
        let file = files.find(file => file.name === filename);
        if (file && file.target === "file") {
          $.get(file.path, function(data) {
            $(".prompt").before("<div class='output'>" + data + "</div>");
          });
        } else {
          $(".prompt").before("<div class='output'>File not found.</div>");
        }
      },
      requiresArgs: true
    },
    "shutdown": {
      description: "Shuts down the console",
      syntax: "shutdown",
      action: function() {
        $(".prompt").before("<div class='output'>Shutting down...</div>");
        setTimeout(function() {
          $(".input").remove();
          $(".output").remove();
          $("body").css("background-color", "black");
        }, 1000);
      }
    },
    "settings": {
      description: "Configures terminal settings",
      syntax: "settings [option] [value]",
      action: function(args) {
        if (args.length > 0) {
          const option = args[0];
          if (option === "textsize") {
            if (args.length > 1) {
              const value = parseInt(args[1]);
              if (isNaN(value) || value < 8 || value > 24) {
                $(".prompt").before("<div class='output'>Invalid text size value. Please enter a number between 8 and 24.</div>");
              } else {
                $(".terminal").css("font-size", value + "px");
              }
            } else {
              $(".prompt").before("<div class='output'>Current text size: " + parseInt($(".terminal").css("font-size")) + "px</div>");
            }
          } else if (option === "font") {
            if (args.length > 1) {
              const font = args[1];
              if (font !== "monospace" && font !== "sans-serif" && font !== "serif") {
                $(".prompt").before("<div class='output'>Invalid font name. Please enter 'monospace', 'sans-serif', or 'serif'.</div>");
              } else {
                $(".terminal").css("font-family", font);
              }
            } else {
              $(".prompt").before("<div class='output'>Current font: " + $(".terminal").css("font-family") + "</div>");
            }
          } else if (option === "save") {
            const settings = {
              textsize: parseInt($(".terminal").css("font-size")),
              font: $(".terminal").css("font-family")
              // more to add
            };
            document.cookie = "terminal_settings=" + JSON.stringify(settings) + ";expires=" + new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)).toUTCString() + ";path=/";
            $(".prompt").before("<div class='output'>Settings saved successfully.</div>");
          } else if (option === "load") {
            const cookie = document.cookie.match(/terminal_settings=([^;]+)/);
            if (cookie) {
              const settings = JSON.parse(cookie[1]);
              $(".terminal").css("font-size", settings.textsize + "px");
              $(".terminal").css("font-family", settings.font);
              // Apply more settings here
              $(".prompt").before("<div class='output'>Settings loaded successfully.</div>");
            } else {
              $(".prompt").before("<div class='output'>No saved settings found.</div>");
            }
          } else {
            $(".prompt").before("<div class='output'>Invalid option. Available options: textsize, font, save, load.</div>");
          }
        } else {
          $(".prompt").before("<div class='output'>Usage: settings [option] [value]</div>");
        }
      }
    },
    "echo": {
      description: "Echoes the input",
      syntax: "echo [text]",
      action: function(args) {
        const text = args.join(" ");
        $(".prompt").before("<div class='output'>" + text + "</div>");
      },
      requiresArgs: true
    }
  };
  
    // Define files
    const files = [
      {name: "CONTACT.PAGE", target: "file", path: "contact.html"},
      {name: "ABOUT.PAGE", target: "file", path: "about.html"},
      {name: "WINDOSE.URL", target: "url", path: "https://www.example.com"},
      {name: "EMAIL.URL", target: "url", path: "mailto:test@test.com"},
      {name: "AUTOEXEC", target: "command", path: "", action: function(){ $(".prompt").before("<div class='output'>Welcome to WINDOSE! Type 'help' to see available commands.</div>");}},
      {name: "INLINEBUFFER.PC", target: "command", path: "", action: function(){ 
        $(".command").hide();
        $(".prompt").before("<div class='html-buffer'></div>");
        $(".html-buffer").append("<iframe src='https://example.com' width='100%' height='100%'></iframe>");
        $(document).on("keydown", function(e) {
          if (e.ctrlKey && e.keyCode == 67) { // CTRL-C pressed
            $(".html-buffer").empty();
            $(".command").show();
            $(".command").focus();
            $(".prompt").before("<div class='output'>HTML Buffer Application closed.</div>");
          }
        });
      }}
      
      
    ];
  
    // Define prefix
    const prefix = "root@localhost:~$ ";
  
    // Add prefix to prompt
    $(".prompt").text(prefix);
  
    // Autofocus on input field
    $(".command").focus();
  
    // Blinking cursor
    setInterval(function() {
      $(".prompt").toggleClass("cursor");
    }, 500);
  


    $(document).on("keydown", ".command", function(e) {
      if (e.keyCode == 9) { // Tab key pressed
        e.preventDefault(); // Prevent focus from changing
        let input = $(this).val();
        let filesT = Object.keys(files);
        let commands = Object.keys(commands);
    
        if (input === "") { // Show all available commands and files
          $(".prompt").before("<div class='output'>" + commands.concat(filesT).join("   ") + "</div>");
        } else { // Show autocompletion options
          let matchingFiles = filesT.filter(function(file) {
            return fileObjects[file].name.startsWith(input);
          });
          let matchingCommands = commands.filter(function(command) {
            return command.startsWith(input);
          });
          let matchingOptions = matchingCommands.concat(matchingFiles);
          if (matchingOptions.length === 1) { // Autocomplete the input if there's only one match
            $(this).val(matchingOptions[0] + " ");
          } else if (matchingOptions.length > 1) { // Show the list of matching options
            $(".prompt").before("<div class='output'>" + matchingOptions.join("   ") + "</div>");
          }
        }
      }
    });
    


    // Handle command input
// Handle command input
$(".command").keypress(function(e) {
    if (e.which == 13) { // Enter key pressed
      let input = $(this).val();
      $(this).val("");
      if (input === "") { // Check if input is empty
        $(".prompt").before("<div class='input'>" + prefix + "</div>");
        return; // Exit the function without executing any commands
      }
      $(".prompt").before("<div class='input'>" + prefix + input + "</div>");
      //$(".prompt").before("<div class='input'>" + prefix + " " + input + "</div>");
      input = input.split(" ");
      let command = input[0];
      let args = input.slice(1);
      let cmd = commands[command];
      if (cmd) {
        if (cmd.requiresArgs && args.length == 0) {
          $(".prompt").before("<div class='output'>Command requires arguments. Type 'help' for syntax.</div>");
        } else {
          cmd.action(args);
        }
      } else {
        $(".prompt").before("<div class='output'>Command not found. Type 'help' for available commands.</div>");
      }
      // Set the scroll position to the bottom
      $(".terminal, .fullscreen").scrollTop($(".terminal, .fullscreen")[0].scrollHeight);
    }
});

  


// Handle click outside of prompt box
$(".terminal").click(function() {
    $(".command").focus();
  });
  

  document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  });
  

  // Hide mouse cursor
  $(".terminal").css("cursor", "none");
  $(".terminal").css("overflow", "hidden");
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  
 
});