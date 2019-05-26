# Predictor

## Install

First install deps and then build:

    $ npm install
    $ npm run build

To build at each file change:

    $ npm start

## Naïve future prediction via context matching

We search times in history that resemble latest events and form our view about future from what came after those times.

**history:** multi-channel binary timeline

**future:** how the history continues.

**context:** the part of the history used for predicting the future.

**match:** we match the context to each point in history. We pick best N matches and their future. We take a weighted average of the futures, weighting by the similarity to the context. The average gives us a prediction about future of the context.

**k-nearest:** This method resembles k nearest neighbors classification algorithm in a way that we find nearest similar events from the history and predict the class of the future based on those findings. In kNN, we find nearest vectors in our training data for a given vector and choose the class in majority-wins manner.

**pros and cons:** Simple. Runs in O(n) where n is the length of the history. Works best where channels are dependent like in music. If channels are independent, favours most common patterns found in the context i.e. patterns with high prior probability in the history.

## Predicting future via first-order patterns

**pattern:** a set of two timelines with equal size: probabilities and a mask. Mask restricts which elements in the probs are significant.

**zeroth-order pattern:** all elements in the mask are zero. Prob values can be anything, they do not matter.

**first-order pattern:** all elements in the mask are zero except one. Prob value for that element can be in inclusive 0..1.

**derived pattern:** we find instances of a first-order pattern happening in the history. By averaging over the instances and comparing these probabilities to the prior probabilities, we find cells that received most information from knowing the first-order pattern.

**pick max information:** for each element in the desired future timeline we find value from the derived pattern that gave the most information for that element.

**cons:** for now, works well for independent channels, but not for codependent channels ':D

**Thoughts for further development:**

- How should we weight the patterns?
  - Some patterns match the context better.
  - Some patterns contradict
  - Some patterns match each other

- Note: we are currently reasoning about and-function.
  - could we similarly reason about other binary functions?

## Information gain of rare events versus common events.

A rare event gives lots of information about neighborhood because ?. Common event give not so much, regardless whether the neighborhood is dependent or not. Rare events are not so good to predict other events even though they may look like it. Therefore when we mix predictions of events, we must take the rarity of the given event into account.
