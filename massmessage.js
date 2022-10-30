/**
	GitHub: https://github.com/justgalak/sinusbot-scripts/

	@author Alexander Raute
	@license MIT
	
	MIT License

	Copyright (c) 2022 Alexander Raute

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
**/
registerPlugin({
	name: 'Message or poke all clients',
	version: '1.0.0',
	engine: ">= 1.0.0",
	backends: ['ts3'],
	description: 'Send private messages or pokes to all clients.',
	author: 'Alexander Raute (@justgalak) <sinusbot@justgalak.com>',
    vars: [{
				name: 'allowedServerGroups',
				title: 'Which server groups(ids) are permitted to use this script?',
				type: 'strings',
				default: []
			},
			{
				name: 'allowedClients',
				title: 'Wich users(uid) are permitted to use this script?',
				type: 'array',
				vars: [{
					name: 'uid',
					title: 'UID',
					indent: 1,
					type: 'string'
				}]
			}
	]
}, (_, config) => {
    // import modules
	const engine = require('engine');
	const backend = require('backend');
	var event = require ('event');
	

	//this makes sure that all scripts have finished loading
	event.on("load", () => {
		const command = require("command");
		//check if the library has been loaded successfully
		if (!command) throw new Error("command.js library not found! Please download command.js and enable it to be able use this script!")
		
// start: massmsg		
		command.createCommand("massmsg")
			.help("Message all currently connected clients.")
			.manual("${command.getCommandPrefix()}massmsg Nachricht")
			.addArgument(args => args.rest.setName("messageString"))
			.checkPermission(client => {
				if(client.getServerGroups().some(group => config.allowedServerGroups.includes(group.id())) || config.allowedClients.some(client_var => client_var.uid === client.uid())) {
					return true;
				}
				else {
					return false;
				}
			})
			.exec((client, args, reply, raw) => {
				if (!client.isSelf()) {
					var client_list = backend.getClients();
					client_list.forEach(function(client) {
						if(!client.isSelf()) {
							client.chat(args.messageString);
						}
					});
				}
			})
// end: massmsg
// start: masspoke /*
		command.createCommand("masspoke")
			.help("Poke all currently connected clients.")
			.manual("${command.getCommandPrefix()}masspoke Nachricht")
			.addArgument(args => args.rest.setName("messageString"))
			.checkPermission(client => {
				if(client.getServerGroups().some(group => config.allowedServerGroups.includes(group.id())) || config.allowedClients.some(client_var => client_var.uid === client.uid())) {
					return true;
				}
				else {
					return false;
				}
			})
			.exec((client, args, reply, raw) => {
				if (!client.isSelf()) {
					var client_list = backend.getClients();
					client_list.forEach(function(client) {
						if(!client.isSelf()) {
							client.poke(args.messageString);
						}
					});
				}
			})
// end: masspoke			
	})
});