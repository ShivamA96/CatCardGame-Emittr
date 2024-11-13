package game

import (
	"errors"
	"math/rand"
	"time"
)

type CardType string

const (
    CatCard         CardType = "Cat"
    ExplodingKitten CardType = "Exploding Kitten"
    DefuseCard      CardType = "Defuse"
    ShuffleCard     CardType = "Shuffle"
)

type Game struct {
    GameID      string
    Username    string
    Deck        []CardType
    DefuseCount int
}

func NewGame(gameID, username string) *Game {
    cardTypes := []CardType{CatCard, ExplodingKitten, DefuseCard, ShuffleCard}
    deck := make([]CardType, 5)
    rand.Seed(time.Now().UnixNano())
    for i := 0; i < 5; i++ {
        deck[i] = cardTypes[rand.Intn(len(cardTypes))]
    }
    rand.Shuffle(len(deck), func(i, j int) { deck[i], deck[j] = deck[j], deck[i] })
    return &Game{GameID: gameID, Username: username, Deck: deck, DefuseCount: 0}
}

func (g *Game) DrawCard() (CardType, error) {
    if len(g.Deck) == 0 {
        return "", errors.New("no cards left")
    }
    card := g.Deck[0]
    g.Deck = g.Deck[1:]

    switch card {
    case ExplodingKitten:
        if g.DefuseCount > 0 {
            g.DefuseCount--
            return DefuseCard, nil
        }
        return ExplodingKitten, errors.New("you lost the game")
    case DefuseCard:
        g.DefuseCount++
    case ShuffleCard:
        g.Deck = NewGame(g.GameID, g.Username).Deck
    }
    return card, nil
}

func (g *Game) IsGameWon() bool {
    return len(g.Deck) == 0
}