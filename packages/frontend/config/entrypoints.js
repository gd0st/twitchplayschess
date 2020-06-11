module.exports = {
	Standalone: {
		path: 'entries/Standalone.tsx',
		template: 'template.html',
		outputHtml: 'standalone.html',
		build: true,
	},
	VideoOverlay: {
		path: 'entries/VideoOverlay.tsx',
		template: 'ext_template.html',
		outputHtml: 'video_overlay.html',
		build: true,
	},
	Config: {
		path: 'entries/Config.tsx',
		template: 'ext_template.html',
		outputHtml: 'config.html',
		build: true,
	},
	LiveConfig: {
		path: 'entries/LiveConfig.tsx',
		template: 'ext_template.html',
		outputHtml: 'live_config.html',
		build: false,
	},
};
