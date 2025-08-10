'use server';

import { interpretUserCommand } from '@/ai/flows/interpret-user-command';
import { useToast } from '@/hooks/use-toast';

export async function handleCommand(command: string): Promise<string> {
  try {
    const interpretation = await interpretUserCommand({ command });

    let response = "You ponder your action. The world seems to shift in response, but nothing concrete happens.";

    const action = interpretation.action?.toLowerCase() || '';
    const object = interpretation.object?.toLowerCase() || '';

    if (action.includes('look')) {
      if (object.includes('room') || object === '') {
        response = "You are in a dusty, stone-walled room. A single torch flickers on the wall, casting long shadows. In the center, a stone pedestal holds an ancient-looking tome. A heavy wooden door is set into the far wall.";
      } else if (object.includes('tome')) {
        response = "The tome is bound in cracked leather and covered in a thick layer of dust. Faint, glowing runes pulse on its cover.";
      } else if (object.includes('door')) {
        response = "The door is made of thick, dark wood with iron bands. It looks incredibly sturdy. There is no visible handle or lock.";
      } else if (object.includes('torch')) {
        response = "It's a simple wooden torch, burning brightly. It provides the only light in the room.";
      } else {
        response = `You look at the ${object}, but can't make out any significant details.`;
      }
    } else if (action.includes('take')) {
      if (object.includes('tome')) {
        response = "You reach out and take the tome. It's surprisingly heavy. The runes on the cover glow brighter as you touch it.";
      } else if (object.includes('torch')) {
        response = "You take the torch from its sconce. The room grows darker, but now you have a light source and a potential tool.";
      } else {
        response = `You try to take the ${object}, but it is either too heavy, nailed down, or simply not takeable.`;
      }
    } else if (action.includes('use')) {
        if (object.includes('tome') && interpretation.details?.includes('door')) {
            response = "You hold the tome up to the door. The runes on the book flare, and matching symbols appear on the door. With a low groan, the door grinds open, revealing a dark passage.";
        } else if (object.includes('torch') && interpretation.details?.includes('tome')) {
            response = "You bring the torch closer to the tome. The heat makes the runes shimmer, but nothing else happens. It feels like you're missing something."
        }
        else {
            response = `You're not sure how to use the ${object} like that.`;
        }
    } else if(action.includes('read')) {
        if(object.includes('tome')){
            response = "You open the tome. The pages are filled with strange symbols. One passage seems to describe a ritual of 'presentation' to open a sealed door..."
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
