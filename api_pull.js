"use strict";

var api_key = "uafbq6ww9aw9d3evbsqpfzxq27zua75x";
var world = "";
var character = "";

function fill_stat(id, stat, percent = false) {
	if (typeof stat !== 'undefined') {
		if (percent) {
			$("#" + id).text(stat.toFixed(2) + "%");
		} else {
			$("#" + id).text(stat);
		}
	}
}

function fill_item(id, item) {
	if (typeof item !== 'undefined') {
		$("#" + id + "_name").text(item.name);
		var get_item_prices = $.get("https://us.api.battle.net/wow/item/" + item.id + "?locale=en_US&apikey=" + api_key, function() {
			var item_price = JSON.parse(get_item_prices.responseText);
			$("#" + id + "_price").text(item_price.buyPrice);
		}).fail(function() {
			error("error finding item");
		});
	}
}

function clear_tags() {
	var tags = $(".tag").nextAll().each(function() {
		$(this).text("..");
	});
}

function error(text) {
	$("#error_msg").text(text);
}

function repoll() {
	var tmp_world = $("#world").val();
	var tmp_character = $("#character").val();
	var class_id = 0;

	if (tmp_world == "") {
		error("No world selected!");
		return;
	} else if (tmp_character == "") {
		error("No character selected!");
		return;
	}

	if ((tmp_world != world) || (tmp_character != character)) {
		world = tmp_world;
		character = tmp_character;
		clear_tags();
		error("");
	} else {
		console.log("didn't bother");
		return;
	}

	var get_stats = $.get("https://us.api.battle.net/wow/character/" + world + "/" + character + "?fields=stats" + "&locale=en_US&apikey=" + api_key, function() {
		var stats = JSON.parse(get_stats.responseText);
		fill_stat("health", stats.stats.health);
		fill_stat("strength", stats.stats.str);
		fill_stat("agility", stats.stats.agi);
		fill_stat("intellect", stats.stats.int);
		fill_stat("stamina", stats.stats.sta);
		fill_stat("armor", stats.stats.armor);
		fill_stat("dodge", stats.stats.dodge, true);
		fill_stat("parry", stats.stats.parry);
		fill_stat("block", stats.stats.block);
		fill_stat("crit", stats.stats.crit, true);
		fill_stat("haste", stats.stats.haste, true);
		fill_stat("speed", stats.stats.speedRating);
		fill_stat("mana_regen", stats.stats.mana5);

		$("#level").text("Level " + stats.level);
		console.log(stats);
		class_id = stats.class;

		var get_items = $.get("https://us.api.battle.net/wow/character/" + world + "/" + character + "?fields=items" + "&locale=en_US&apikey=" + api_key, function() {
			var items = JSON.parse(get_items.responseText);

			fill_item("back", items.items.back);
			fill_item("chest", items.items.chest);
			fill_item("feet", items.items.feet);
			fill_item("finger1", items.items.finger1);
			fill_item("finger2", items.items.finger2);
			fill_item("hands", items.items.hands);
			fill_item("head", items.items.head);
			fill_item("legs", items.items.legs);
			fill_item("main_hand", items.items.mainHand);
			fill_item("neck", items.items.neck);
			fill_item("shirt", items.items.shirt);
			fill_item("shoulders", items.items.shoulder);
			fill_item("trinket1", items.items.trinket1);
			fill_item("trinket2", items.items.trinket2);
			fill_item("waist", items.items.waist);
			fill_item("wrist", items.items.wrist);

			$("#character_name").text(character);

			var get_weapon_stats = $.get("https://us.api.battle.net/wow/item/" + items.items.mainHand.id + "?locale=en_US&apikey=" + api_key, function() {
				var weapon_stats = JSON.parse(get_weapon_stats.responseText);

				if ((typeof weapon_stats.weaponInfo.damage.min !== 'undefined') && (typeof weapon_stats.weaponInfo.damage.max !== 'undefined')) {
					$("#damage").text(weapon_stats.weaponInfo.damage.min + " - " + weapon_stats.weaponInfo.damage.max);
				}
				fill_stat("attack_speed", weapon_stats.weaponInfo.weaponSpeed);
				if (typeof weapon_stats.weaponInfo.dps !== 'undefined') {
					$("#dps").text(weapon_stats.weaponInfo.dps.toFixed(2));
				}

				var get_class = $.get("https://us.api.battle.net/wow/data/character/classes?locale=en_US&apikey=" + api_key, function() {
					var player_class = JSON.parse(get_class.responseText);
					console.log(player_class);
					for (var i = 0; i < player_class.classes.length; i++) {
						if (player_class.classes[i].id == class_id) {
							$("#class").text(player_class.classes[i].name);
							break;
						}
					}

					error("");
				}).fail(function() {
					error("error finding " + character + "'s class");
				});

			}).fail(function() {
				error("error finding " + character + "'s weapon stats");
			});

		}).fail(function() {
			error("error finding " + character + "'s items");
		});

	}).fail(function() {
		error("error finding " + character + "'s stats");
	});
}
