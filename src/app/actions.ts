
'use server';

import { interpretUserCommand } from '@/ai/flows/interpret-user-command';
import { getAdminDb } from '@/lib/firebase';


// Simple world representation
const world = {
  'start': {
    description: "You are in a dusty, stone-walled room. A single torch flickers on the wall, casting long shadows. In the center, a stone pedestal holds an ancient-looking tome. A heavy wooden door is set into the north wall.",
    items: {
      'tome': "The tome is bound in cracked leather and covered in a thick layer of dust. Faint, glowing runes pulse on its cover.",
      'door': "The door is made of thick, dark wood with iron bands. It looks incredibly sturdy. There is no visible handle or lock.",
      'torch': "It's a simple wooden torch, burning brightly. It provides the only light in the room."
    },
    exits: {
      'north': 'hallway'
    },
    lockedExits: {
        'north': "The door is sealed by some unseen force. The runes on the tome seem to resonate with it."
    }
  },
  'hallway': {
      description: "You've entered a long, dark hallway. The air is damp and cool. There's a door to the west and the path continues to the east. The door you came from is to the south.",
      items: {},
      exits: {
          'south': 'start',
          'west': 'library',
          'east': 'armory'
      }
  }
};

let playerState = {
    location: 'start',
    inventory: [] as string[],
    tomeRead: false,
};

async function testFirestore() {
  const adminDb = getAdminDb();
  const testDocRef = adminDb.collection('test-collection').doc('test-doc');

  try {
    const testData = { message: 'Hello from Firebase!', timestamp: new Date() };
    await testDocRef.set(testData);
    console.log('Document written to Firestore.');

    const docSnap = await testDocRef.get();
    if (docSnap.exists) {
      const data = docSnap.data();
      console.log('Document data:', data);
      return `Successfully connected to Firebase! Test document contains: "${data?.message}"`;
    } else {
      console.log('No such document!');
      return 'Connected to Firebase, but failed to read the test document.';
    }
  } catch (error) {
    console.error("Error testing Firestore: ", error);
    return "Failed to connect to Firebase. See server logs for details.";
  }
}


export async function handleCommand(command: string): Promise<string> {
  if (command.toLowerCase() === 'test firestore') {
    return await testFirestore();
  }

  try {
    const interpretation = await interpretUserCommand({ command });

    let response = "You ponder your action. The world seems to shift in response, but nothing concrete happens.";

    const action = interpretation.action?.toLowerCase() || '';
    const object = interpretation.object?.toLowerCase() || '';

    const currentLocation = world[playerState.location as keyof typeof world];

    if (['north', 'south', 'east', 'west'].includes(action)) {
        if (currentLocation.exits && action in currentLocation.exits) {
            const nextLocationKey = currentLocation.exits[action as keyof typeof currentLocation.exits];
            if (nextLocationKey) {
                if (currentLocation.lockedExits && action in currentLocation.lockedExits && playerState.inventory.includes('tome')) {
                     return currentLocation.lockedExits[action as keyof typeof currentLocation.lockedExits]!;
                }
                playerState.location = nextLocationKey;
                const newLocation = world[playerState.location as keyof typeof world];
                return newLocation.description;
            }
        }
        return "You can't go that way.";
    }


    if (action.includes('look')) {
      if (object.includes('room') || object === '') {
        response = currentLocation.description;
      } else if (currentLocation.items && object in currentLocation.items) {
        response = currentLocation.items[object as keyof typeof currentLocation.items];
      } else if (object.includes('door') && 'door' in currentLocation.items) {
        response = currentLocation.items.door;
      }
       else {
        response = `You look at the ${object}, but can't make out any significant details.`;
      }
    } else if (action.includes('take')) {
        if (object.includes('tome') && 'tome' in currentLocation.items) {
            if(!playerState.inventory.includes('tome')) {
                playerState.inventory.push('tome');
                response = "You reach out and take the tome. It's surprisingly heavy. The runes on the cover glow brighter as you touch it.";
            } else {
                response = "You already have the tome.";
            }
        } else if (object.includes('torch') && 'torch' in currentLocation.items) {
            if(!playerState.inventory.includes('torch')) {
                playerState.inventory.push('torch');
                response = "You take the torch from its sconce. The room grows darker, but now you have a light source and a potential tool.";
            } else {
                response = "You already have the torch.";
            }
        } else {
            response = `You try to take the ${object}, but it is either too heavy, nailed down, or simply not takeable.`;
      }
    } else if (action.includes('use')) {
        if (object.includes('tome') && interpretation.details?.includes('door')) {
            if (playerState.inventory.includes('tome') && playerState.tomeRead) {
                if (currentLocation.lockedExits && 'north' in currentLocation.lockedExits) {
                    delete currentLocation.lockedExits['north' as keyof typeof currentLocation.lockedExits];
                    response = "You hold the tome up to the door. The runes on the book flare, and matching symbols appear on the door. With a low groan, the door grinds open, revealing a dark passage.";
                } else {
                    response = "The door is already open.";
                }
            } else if (playerState.inventory.includes('tome')) {
                response = "You haven't read the tome yet. You don't know how to use it.";
            } else {
                response = "You don't have the tome.";
            }
        } else if (object.includes('torch') && interpretation.details?.includes('tome')) {
            response = "You bring the torch closer to the tome. The heat makes the runes shimmer, but nothing else happens. It feels like you're missing something."
        }
        else {
            response = `You're not sure how to use the ${object} like that.`;
        }
    } else if(action.includes('read')) {
        if(object.includes('tome')){
            if (playerState.inventory.includes('tome')) {
                playerState.tomeRead = true;
                response = "You open the tome. The pages are filled with strange symbols. One passage seems to describe a ritual of 'presentation' to open a sealed door..."
            } else {
                response = "You don't have the tome to read.";
            }
        } else {
            response = "There is nothing here to read."
        }
    }

    return response;
  } catch (error) {
    console.error('Error in handleCommand:', error);
    return "A strange energy crackles, and your command fizzles into nothingness. Perhaps try a different phrasing?";
  }
}
