registerPlugin({
 name: 'Server Group Icon',
 version: '1.0',
 description: 'Ändert das Icon einer Servergruppe, basierend auf dem Input einer externen Datei.',
 author: 'Galak <justgalak@gmail.com>',
 vars: [ 
    {
        name: 'servergroups',
        title: 'Servergruppen',
        type: 'array',
        vars: [{
                name: 'servergroup',
                title: 'Servergruppen ID',
                indent: 2,
                type: 'number'
            } ,
            {
                name: 'interval',
                title: 'Update Intervall in Minuten (mindestens 1 Minute)',
                type: 'number',
                indent: 2,
                placeholder: 1
            },
            {
                name: 'url',
                title: 'URL',
                type: 'string',
				indent: 2
            },
			{
                name: 'icon_done',
                title: 'Icon(ID), wenn es keine offenen Anfragen gibt.',
                type: 'number',
				indent: 2
            },
			{
                name: 'icon_todo',
                title: 'Icon(ID), wenn es offene Anfragen gibt.',
                type: 'number',
				indent: 2
            }
        ]
    }
]
   
}, function(sinusbot, config) {
    
	var engine = require('engine');
	var store = require('store');
	var backend = require('backend');
	
	function ServerGroupIcon(serverGroupConfig){
		var group = backend.getServerGroupByID(serverGroupConfig.servergroup);
		
		if (backend.isConnected()){
			// send request
			sinusbot.http({
				'method': 'GET',
				'url': serverGroupConfig.url,
				'timeout': 6000,
			}, function (error, response) {
			
			if (response.statusCode != 200) {
					engine.log(error);
					return;
				}
				
				// parse JSON response
				var res;
				try {
					res = JSON.parse(response.data);
				} catch (err) {
					engine.log(err.message);
				}
				
				var currentIndex = (store.get(serverGroupConfig.servergroup) || 0);
				var channel = backend.getChannelByID(serverGroupConfig.servergroup);
				if (!serverGroupConfig.url){
					engine.log('Es wurde keine URL angegeben ' + serverGroupConfig.servergroup + '!' + currentIndex);
					return;
				}
				
				if (!serverGroupConfig.icon_done || !serverGroupConfig.icon_todo){
					engine.log('Es wurden nicht beide Icon-IDs angegeben!' + ' - Index: ' + currentIndex);
					return;
				}
				
				var icon;
				if(res['status'] == 'todo') {
					icon = serverGroupConfig.icon_todo;
				} else {
					icon = serverGroupConfig.icon_done;
				}
				
				
				var data = group.addPermission('i_icon_id');
				data.setValue(icon);
				data.save();
				engine.log('Setze Servergruppen Icon: ' + icon + ' - Status: ' + res['status']);
				
				currentIndex++;
				store.set(serverGroupConfig.servergroup, currentIndex);
				
			});

			
		}
    }

    for (var i = 0; i < config.servergroups.length; i++){
        var serverGroupConfig = config.servergroups[i];
        ServerGroupIcon(serverGroupConfig);
        var interval = (+serverGroupConfig.interval || 0) * 1000 * 60;
        if (interval < 60000) {
            interval = 60000;
        }
        setInterval(function() {ServerGroupIcon(serverGroupConfig);}, interval);
    }
});